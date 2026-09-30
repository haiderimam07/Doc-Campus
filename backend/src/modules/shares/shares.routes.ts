import type { FastifyInstance } from 'fastify';
import { authGuard, currentUserId } from '../../lib/auth.js';
import { postIdParams } from '../../lib/common.schema.js';
import { validate } from '../../lib/validate.js';
import { sharePost } from './shares.service.js';

export default async function sharesRoutes(app: FastifyInstance) {
  // Tight limit: every call inserts a row, so this is the easiest endpoint to spam.
  app.post(
    '/posts/:postId/share',
    { preHandler: authGuard(app), config: { rateLimit: { max: 20, timeWindow: '1 minute' } } },
    async (req) => {
      const { postId } = validate(postIdParams, req.params);
      return sharePost(app, currentUserId(req), postId);
    }
  );
}
