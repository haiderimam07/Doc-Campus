import { z } from 'zod';

export const feedQuerySchema = z.object({
  cursor: z.string().optional(), // opaque, base64(`${rankedAt}_${id}`)
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type FeedQueryInput = z.infer<typeof feedQuerySchema>;