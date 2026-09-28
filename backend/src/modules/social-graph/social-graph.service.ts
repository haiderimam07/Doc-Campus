import { FastifyInstance } from 'fastify';
import { eq, inArray } from 'drizzle-orm';
import { follows } from '../../db/schema.js';

// People I follow
export async function getFollowingIds(fastify: FastifyInstance, userId: string) {
  const rows = await fastify.db
    .select({ id: follows.followingId })
    .from(follows)
    .where(eq(follows.followerId, userId));

  return rows.map((row) => row.id);
}

// People who follow me
export async function getFollowerIds(fastify: FastifyInstance, userId: string) {
  const rows = await fastify.db
    .select({ id: follows.followerId })
    .from(follows)
    .where(eq(follows.followingId, userId));

  return rows.map((row) => row.id);
}

// Friends of friends: people that the people I follow are following.
// Takes followingIds so callers that already have them don't refetch.
export async function getFriendOfFriendIds(
  fastify: FastifyInstance,
  followingIds: string[],
  limit = 500 // safety cap for very large networks
) {
  if (followingIds.length === 0) return [];

  const rows = await fastify.db
    .selectDistinct({ id: follows.followingId })
    .from(follows)
    .where(inArray(follows.followerId, followingIds))
    .limit(limit);

  return rows.map((row) => row.id);
}

// Convenience: the whole network in one call
export async function getNetwork(fastify: FastifyInstance, userId: string) {
  const [followingIds, followerIds] = await Promise.all([
    getFollowingIds(fastify, userId),
    getFollowerIds(fastify, userId),
  ]);
  const friendOfFriendIds = await getFriendOfFriendIds(fastify, followingIds);

  return { followingIds, followerIds, friendOfFriendIds };
}