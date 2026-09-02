import { z } from 'zod';

export const createPostSchema = z.object({
  description: z.string().max(2000).optional(),
  fileUrl: z.string().url('Invalid file URL'),
  fileType: z.enum(['pdf', 'image', 'doc', 'other']),
});

export const postParamsSchema = z.object({
  id: z.string().uuid('Invalid post ID'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;