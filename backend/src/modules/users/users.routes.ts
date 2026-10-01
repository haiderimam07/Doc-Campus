import { FastifyInstance } from 'fastify';
import { paginationQuerySchema, updateProfileSchema } from './users.schema.js';
import { uploadAvatarToStorage } from '../../lib/upload.js';
import {
  getUserSummary,
  getProfileByUsername,
  getFollowers,
  getFollowing,
  updateProfile,
  followUser,
  unfollowUser,
  removeFollower
} from './users.service.js';

export default async function usersRoutes(fastify: FastifyInstance) {

  // 1. STATIC / SPECIFIC ROUTES (Must go BEFORE dynamic parameters like /:username)

  // Sidebar mini-card endpoint for the logged-in user feed
  fastify.get('/me/summary', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const summary = await getUserSummary(fastify, request.user.sub);
    return summary;
  });
  
  //update profile
  fastify.patch('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  const currentUserId = request.user.sub;

  if (request.isMultipart()) {
    let bioVal: string | undefined;
    let removeAvatarVal: string | undefined;
    let avatarFile: { buffer: Buffer; filename: string; mimetype: string } | null = null;

    for await (const part of request.parts()) {
      if (part.type === 'file') {
        // ALWAYS consume the stream, even if you don't want it
        const buffer = await part.toBuffer();
        if ((part.fieldname === 'avatar' || part.fieldname === 'file') && part.filename && buffer.length) {
          avatarFile = { buffer, filename: part.filename, mimetype: part.mimetype };
        }
      } else if (part.fieldname === 'bio') {
        bioVal = part.value as string;
      } else if (part.fieldname === 'removeAvatar') {
        removeAvatarVal = part.value as string;
      }
    }

    const parsedInput = updateProfileSchema.parse({
      ...(bioVal !== undefined && { bio: bioVal }),
    });

    let avatarUrlToSet: string | null | undefined;
    if (removeAvatarVal === 'true' || removeAvatarVal === '1') {
      avatarUrlToSet = null;
    } else if (avatarFile) {
      const { fileUrl } = await uploadAvatarToStorage(avatarFile); // change to accept a buffer
      avatarUrlToSet = fileUrl;
    }

    return updateProfile(fastify, currentUserId, {
      ...parsedInput,
      ...(avatarUrlToSet !== undefined && { avatarUrl: avatarUrlToSet }),
    });
  }

  const input = updateProfileSchema.parse(request.body);
  return updateProfile(fastify, currentUserId, input);
});


  // 2. DYNAMIC PARAMETER ROUTES (/:username)

  // Unified full profile endpoint (handles both self and other users)
  fastify.get('/:username', { preHandler: [fastify.tryAuthenticate] }, async (request, reply) => {
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
    const query = paginationQuerySchema.parse(request.query);
    const followers = await getFollowers(fastify, username, query);

    if (!followers) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return followers;
  });

  // Following list
  fastify.get('/:username/following', async (request, reply) => {
    const { username } = request.params as { username: string };
    const query = paginationQuerySchema.parse(request.query);
    const following = await getFollowing(fastify, username, query);

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

  fastify.delete(
  '/me/followers/:username',
  { preHandler: [fastify.authenticate] },
  async (request, reply) => {
    const { username } = request.params as { username: string };
 
    try {
      const result = await removeFollower(fastify, request.user.sub, username);
      return result;
    } catch (err) {
      return reply.status(400).send({ error: (err as Error).message });
    }
  }
);
}
