import type { FastifyInstance } from 'fastify';
import { authGuard, currentUserId } from '../../lib/auth.js';
import { commentIdParams, postIdParams } from '../../lib/common.schema.js';
import { validate } from '../../lib/validate.js';
import {
  createCommentBody,
  listCommentsQuery,
  listRepliesQuery,
  updateCommentBody,
} from './comments.schema.js';
import {
  createComment,
  deleteComment,
  listComments,
  listReplies,
  updateComment,
} from './comments.service.js';

export default async function commentsRoutes(app: FastifyInstance) {
  const auth = authGuard(app);

  // Page of top-level comments (default 5) — call again with `nextCursor` for "Load more comments"
  app.get('/posts/:postId/comments', { preHandler: auth }, async (req) => {
    const { postId } = validate(postIdParams, req.params);
    const query = validate(listCommentsQuery, req.query);
    return listComments(app, currentUserId(req), postId, query);
  });

  // Page of replies (default 3) — "View replies" / "Load more replies"
  app.get('/comments/:commentId/replies', { preHandler: auth }, async (req) => {
    const { commentId } = validate(commentIdParams, req.params);
    const query = validate(listRepliesQuery, req.query);
    return listReplies(app, currentUserId(req), commentId, query);
  });

  // Create a comment, or a reply when `parentId` is present
  app.post(
    '/posts/:postId/comments',
    { preHandler: auth, config: { rateLimit: { max: 20, timeWindow: '1 minute' } } },
    async (req, reply) => {
      const { postId } = validate(postIdParams, req.params);
      const input = validate(createCommentBody, req.body);
      const created = await createComment(app, currentUserId(req), postId, input);
      return reply.code(201).send(created);
    }
  );

  app.patch(
    '/comments/:commentId',
    { preHandler: auth, config: { rateLimit: { max: 30, timeWindow: '1 minute' } } },
    async (req) => {
      const { commentId } = validate(commentIdParams, req.params);
      const { body } = validate(updateCommentBody, req.body);
      return updateComment(app, currentUserId(req), commentId, body);
    }
  );

  app.delete('/comments/:commentId', { preHandler: auth }, async (req) => {
    const { commentId } = validate(commentIdParams, req.params);
    return deleteComment(app, currentUserId(req), commentId);
  });
}
