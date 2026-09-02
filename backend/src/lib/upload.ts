import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { MultipartFile } from '@fastify/multipart';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';

// 1. Initialize S3 Client configured for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Helper: Map MIME type / extension to your Drizzle fileType enum
function detectFileType(mimetype: string, filename: string): 'image' | 'pdf' | 'doc' | 'other' {
  const ext = extname(filename).toLowerCase();

  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf' || ext === '.pdf') return 'pdf';
  if (
    [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(mimetype) ||
    ['.doc', '.docx'].includes(ext)
  ) {
    return 'doc';
  }

  return 'other';
}

// 2. Stream Upload Handler
export async function uploadToStorage(file: MultipartFile) {
  const fileExt = extname(file.filename);
  const fileKey = `posts/${randomUUID()}${fileExt}`;
  const bucketName = process.env.R2_BUCKET_NAME!;

  // Stream directly into R2 bucket
  const parallelUpload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.file,
      ContentType: file.mimetype,
    },
  });

  await parallelUpload.done();

  // Public access URL
  const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`;
  const fileType = detectFileType(file.mimetype, file.filename);

  return {
    fileUrl: publicUrl,
    fileType,
  };
}