import { FastifyInstance } from 'fastify';
import { updateProfileSchema } from './users.schema.js';
import {
  getUserSummary,
  getProfileByUsername,
  getFollowers,
  getFollowing,
  updateProfile,
  followUser,
  unfollowUser,
} from './users.service.js';

export default async function usersRoutes(fastify: FastifyInstance) {

  // 1. STATIC / SPECIFIC ROUTES (Must go BEFORE dynamic parameters like /:username)

  // Sidebar mini-card endpoint for the logged-in user feed
  fastify.get('/me/summary', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const summary = await getUserSummary(fastify, request.user.sub);
    return summary;
  });

  // Update authenticated user profile
  fastify.patch('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const input = updateProfileSchema.parse(request.body);
    const updated = await updateProfile(fastify, request.user.sub, input);
    return updated;
  });


  // 2. DYNAMIC PARAMETER ROUTES (/:username)

  // Unified full profile endpoint (handles both self and other users)
  fastify.get('/:username', async (request, reply) => {
    const { username } = request.params as { username: string };
    
    // Pass current user ID if token exists (optional auth), otherwise null
    const currentUserId = request.user?.sub ?? null;
    const profile = await getProfileByUsername(fastify, username, currentUserId);

    if (!profile) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return profile;
  });

  // Followers list
  fastify.get('/:username/followers', async (request, reply) => {
    const { username } = request.params as { username: string };
    const followers = await getFollowers(fastify, username);

    if (!followers) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return followers;
  });

  // Following list
  fastify.get('/:username/following', async (request, reply) => {
    const { username } = request.params as { username: string };
    const following = await getFollowing(fastify, username);

    if (!following) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return following;
  });


  // 3. ACTIONS / MUTATIONS (Follow & Unfollow)

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