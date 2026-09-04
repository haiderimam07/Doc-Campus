  import { z } from 'zod';

  export const createPostSchema = z.object({
    description: z.string().max(2000).optional(),
    fileUrl: z.string().url('Invalid file URL'),
    fileType: z.enum(['pdf', 'image', 'doc', 'other']),
  });

  export const postParamsSchema = z.object({
    id: z.string().uuid('Invalid post ID'),
  });

  // posts.schema.ts
export const feedQuerySchema = z.object({
  cursor: z.string().optional(), // opaque, base64(`${createdAt}_${id}`)
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
  export type FeedQueryInput = z.infer<typeof feedQuerySchema>;

  export type CreatePostInput = z.infer<typeof createPostSchema>;