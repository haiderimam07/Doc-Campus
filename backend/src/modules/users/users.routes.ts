import { FastifyInstance } from 'fastify';
import { paginationQuerySchema, updateProfileSchema } from './users.schema.js';
import { uploadToStorage } from '../../lib/upload.js';
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
  
  //update profile
  fastify.patch('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  const currentUserId = request.user.sub;

  if (request.isMultipart()) {
    const parts = request.parts();

    let bioVal: string | undefined = undefined;
    let removeAvatarVal: string | undefined = undefined;
    let uploadedFileStream: any = null;

    for await (const part of parts) {
      if (part.type === 'file') {
        if (part.fieldname === 'avatar' || part.fieldname === 'file') {
          uploadedFileStream = part;
        }
      } else {
        // Handle text fields
        if (part.fieldname === 'bio') {
          bioVal = part.value as string;
        }
        if (part.fieldname === 'removeAvatar') {
          removeAvatarVal = part.value as string;
        }
      }
    }

    const parsedInput = updateProfileSchema.parse({
      ...(bioVal !== undefined && { bio: bioVal }),
    });

    let avatarUrlToSet: string | null | undefined = undefined;

    // Case A: User explicitly requests avatar removal
    if (removeAvatarVal === 'true' || removeAvatarVal === '1') {
      avatarUrlToSet = null;
    } 
    // Case B: User uploaded a new file stream
    else if (uploadedFileStream && uploadedFileStream.filename) {
      const { fileUrl } = await uploadToStorage(uploadedFileStream);
      avatarUrlToSet = fileUrl;
    }

    const updated = await updateProfile(fastify, currentUserId, {
      ...parsedInput,
      ...(avatarUrlToSet !== undefined && { avatarUrl: avatarUrlToSet }),
    });

    return updated;
  }

  // Standard JSON payload fallback
  const input = updateProfileSchema.parse(request.body);
  const updated = await updateProfile(fastify, currentUserId, input);
  return updated;
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
}