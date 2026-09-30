import type { FastifyInstance } from 'fastify';
import { authGuard, currentUserId } from '../../lib/auth.js';
import { commentIdParams, postIdParams } from '../../lib/common.schema.js';
import { validate } from '../../lib/validate.js';
import { listLikersQuery } from './likes.schema.js';
import {
  likeComment,
  likePost,
  listPostLikers,
  unlikeComment,
  unlikePost,
} from './likes.service.js';

export default async function likesRoutes(app: FastifyInstance) {
  const auth = authGuard(app);
  // Per-route limits only take effect if @fastify/rate-limit is registered (harmless otherwise).
  const write = { preHandler: auth, config: { rateLimit: { max: 120, timeWindow: '1 minute' } } };

  // Post likes
  app.put('/posts/:postId/like', write, async (req) => {
    const { postId } = validate(postIdParams, req.params);
    return likePost(app, currentUserId(req), postId);
  });

  app.delete('/posts/:postId/like', write, async (req) => {
    const { postId } = validate(postIdParams, req.params);
    return unlikePost(app, currentUserId(req), postId);
  });

  app.get('/posts/:postId/likes', { preHandler: auth }, async (req) => {
    const { postId } = validate(postIdParams, req.params);
    const query = validate(listLikersQuery, req.query);
    return listPostLikers(app, postId, query);
  });

  // Comment likes
  app.put('/comments/:commentId/like', write, async (req) => {
    const { commentId } = validate(commentIdParams, req.params);
    return likeComment(app, currentUserId(req), commentId);
  });

  app.delete('/comments/:commentId/like', write, async (req) => {
    const { commentId } = validate(commentIdParams, req.params);
    return unlikeComment(app, currentUserId(req), commentId);
  });
}
