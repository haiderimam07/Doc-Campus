import { z } from 'zod';

export const updateProfileSchema = z.object({
  bio: z.string().max(280).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const paginationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;