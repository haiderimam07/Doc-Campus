import { z } from 'zod';

export const postIdParams = z.object({ postId: z.string().uuid() });
export const commentIdParams = z.object({ commentId: z.string().uuid() });

export const pageQuery = (defaultLimit: number, maxLimit: number) =>
  z.object({
    cursor: z.string().max(300).optional(),
    limit: z.coerce.number().int().min(1).max(maxLimit).default(defaultLimit),
  });
