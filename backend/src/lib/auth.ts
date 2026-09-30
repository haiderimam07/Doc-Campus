import type { FastifyInstance, FastifyRequest } from 'fastify';
import { AppError } from './errors.js';

/** Same guard your posts routes use: `preHandler: [fastify.authenticate]`. */
export const authGuard = (app: FastifyInstance) => [app.authenticate];

/** Your JWT payload keeps the user id in `sub` (same as `request.user.sub` in posts.routes.ts). */
export function currentUserId(req: FastifyRequest): string {
  const sub = (req as unknown as { user?: { sub?: string } }).user?.sub;
  if (!sub) throw new AppError(401, 'Unauthorized', 'UNAUTHORIZED');
  return sub;
}
