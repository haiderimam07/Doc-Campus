import { FastifyInstance } from 'fastify';
import { updateProfileSchema } from './users.schema.js';
import {
  getPublicProfile,
  updateProfile,
  followUser,
  unfollowUser,
} from './users.service.js';

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/:username', async (request, reply) => {
    const { username } = request.params as { username: string };
    const profile = await getPublicProfile(fastify, username);

    if (!profile) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return profile;
  });

  fastify.patch('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const input = updateProfileSchema.parse(request.body);
    const updated = await updateProfile(fastify, request.user.sub, input);
    return updated;
  });

  fastify.post('/:username/follow', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { username } = request.params as { username: string };

    try {
      const result = await followUser(fastify, request.user.sub, username);
      return result;
    } catch (err) {
      return reply.status(400).send({ error: (err as Error).message });
    }
  });

  fastify.delete('/:username/follow', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { username } = request.params as { username: string };

    try {
      const result = await unfollowUser(fastify, request.user.sub, username);
      return result;
    } catch (err) {
      return reply.status(400).send({ error: (err as Error).message });
    }
  });
}