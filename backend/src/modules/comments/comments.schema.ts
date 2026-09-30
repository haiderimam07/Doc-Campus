import { z } from 'zod';
import { pageQuery } from '../../lib/common.schema.js';

const commentText = z.string().trim().min(1, 'Comment cannot be empty').max(1000);

export const createCommentBody = z.object({
  body: commentText,
  parentId: z.string().uuid().optional(), // set = this is a reply
});

export const updateCommentBody = z.object({ body: commentText });

// LinkedIn-style: 5 top-level comments per page, 3 replies per page.
export const listCommentsQuery = pageQuery(5, 20);
export const listRepliesQuery = pageQuery(3, 10);

export type CreateCommentInput = z.infer<typeof createCommentBody>;
