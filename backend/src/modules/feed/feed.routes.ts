import { FastifyInstance } from 'fastify';
import { feedQuerySchema } from './feed.schema.js';
import { getHybridFeed } from './feed.service.js';

export default async function feedRoutes(fastify: FastifyInstance) {
  // GET /feed — Unified feed (optional auth, guest fallback)
  fastify.get('/feed', { preHandler: [fastify.tryAuthenticate] }, async (request) => {
    const { cursor, limit } = feedQuerySchema.parse(request.query);
    const currentUserId = request.user?.sub ?? null;

    return getHybridFeed(fastify, currentUserId, { cursor, limit });
  });
}