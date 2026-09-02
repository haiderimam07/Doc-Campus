import { FastifyInstance } from 'fastify';
import { postParamsSchema } from './posts.schema.js';
import { uploadToStorage } from '../../lib/upload.js';// Your storage utility (Cloudinary/S3)
import {
  createPost,
  getPostById,
  getPostsByUsername,
  deletePost,
  getHybridFeed,
} from './posts.service.js';

export default async function postsRoutes(fastify: FastifyInstance) {

  // GET /posts/feed — Unified Hybrid Feed (Optional auth for guest fallback)
  fastify.get('/feed', async (request, reply) => {
    const { cursor, limit } = request.query as { cursor?: string; limit?: string };
    const currentUserId = request.user?.sub ?? null;

    const feed = await getHybridFeed(fastify, currentUserId, {
      cursor,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return feed;
  });

  // POST /posts — Create Post (Multipart File Upload + Description)
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'A file attachment is required' });
    }

    // Extract description text field from multipart fields
    const descriptionField = data.fields.description;
    const description = typeof descriptionField === 'object' && 'value' in descriptionField 
      ? (descriptionField.value as string) 
      : '';

    // 1. Upload file stream to Cloudinary/S3 storage
    const { fileUrl, fileType } = await uploadToStorage(data);

    // 2. Save post record to PostgreSQL
    const post = await createPost(fastify, request.user.sub, {
      description,
      fileUrl,
      fileType,
    });

    // 3. Enqueue BullMQ OCR processing job (Phase 6 placeholder)
    // await fastify.ocrQueue.add('process-ocr', { postId: post.id, fileUrl: post.fileUrl });

    return reply.status(201).send(post);
  });

  // GET /posts/user/:username — User Profile Posts
  fastify.get('/user/:username', async (request, reply) => {
    const { username } = request.params as { username: string };
    const userPosts = await getPostsByUsername(fastify, username);

    return userPosts;
  });

  // GET /posts/:id — Fetch Single Post Details
  fastify.get('/:id', async (request, reply) => {
    const { id } = postParamsSchema.parse(request.params);
    const post = await getPostById(fastify, id);

    if (!post) {
      return reply.status(404).send({ error: 'Post not found' });
    }

    return post;
  });

  // DELETE /posts/:id — Delete Post (Author only)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = postParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const success = await deletePost(fastify, id, userId);

    if (!success) {
      return reply.status(403).send({ error: 'Unauthorized or post not found' });
    }

    return { message: 'Post deleted successfully' };
  });
}