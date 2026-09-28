import { z } from 'zod';


const descriptionSchema = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value ? value : undefined));

export const createPostSchema = z.object({
  description: z.string().max(2000).optional(),
  fileUrl: z.string().url('Invalid file URL'),
  fileType: z.enum(['pdf', 'image', 'doc', 'other', 'link']),
});

// Body for link posts (sent as JSON instead of multipart)
export const createLinkPostSchema = z.object({
  link: z
    .string()
    .trim()
    .max(2048)
    .url('Invalid link')
    .refine((value) => /^https?:\/\//i.test(value), 'Link must start with http:// or https://'),
  description: z.string().max(2000).optional(),
});

export const postParamsSchema = z.object({
  id: z.string().uuid('Invalid post ID'),
});

export const feedQuerySchema = z.object({
  cursor: z.string().optional(), // opaque, base64(`${createdAt}_${id}`)
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type FeedQueryInput = z.infer<typeof feedQuerySchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateLinkPostInput = z.infer<typeof createLinkPostSchema>;