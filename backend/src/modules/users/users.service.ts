import { FastifyInstance } from 'fastify';
import { eq, and, count, desc, lt } from 'drizzle-orm';
import { decodeCursor, encodeCursor } from '../../lib/pagination.js';
import { users, follows } from '../../db/schema.js';
import { UpdateProfileInput } from './users.schema.js';

interface PaginationParams {
  cursor?: string;
  limit: number;
}

const publicUserFields = {
  id: users.id,
  username: users.username,
  bio: users.bio,
  avatarUrl: users.avatarUrl,
  createdAt: users.createdAt,
};

// 1. Lightweight summary for sidebar/navbar
export async function getUserSummary(fastify: FastifyInstance, userId: string) {
  const [user] = await fastify.db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId));

  return user ?? null;
}

// 2. Full profile lookup (handles self vs other user context)
export async function getProfileByUsername(
  fastify: FastifyInstance,
  targetUsername: string,
  currentUserId: string | null
) {
  const [targetUser] = await fastify.db
    .select({
      id: users.id,
      username: users.username,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, targetUsername));

  if (!targetUser) {
    return null;
  }

  const isSelf = currentUserId === targetUser.id;

  let isFollowing = false;
  if (currentUserId && !isSelf) {
    const [followRecord] = await fastify.db
      .select({ followerId: follows.followerId })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, targetUser.id)
        )
      );

    isFollowing = !!followRecord;
  }

  const [{ followersCount }] = await fastify.db
    .select({ followersCount: count() })
    .from(follows)
    .where(eq(follows.followingId, targetUser.id));

  const [{ followingCount }] = await fastify.db
    .select({ followingCount: count() })
    .from(follows)
    .where(eq(follows.followerId, targetUser.id));

  return {
    ...targetUser,
    followersCount: Number(followersCount ?? 0),
    followingCount: Number(followingCount ?? 0),
    isSelf,
    isFollowing,
  };
}

// 3. Simple public profile
export async function getPublicProfile(fastify: FastifyInstance, username: string) {
  const [user] = await fastify.db
    .select({
      id: users.id,
      username: users.username,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username));

  return user ?? null;
}

// Internal helper
async function getUserIdByUsername(fastify: FastifyInstance, username: string) {
  const [user] = await fastify.db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username));

  return user?.id ?? null;
}

// 4. Followers & Following lists
export async function getFollowers(
  fastify: FastifyInstance,
  username: string,
  { cursor, limit }: PaginationParams
) {
  const userId = await getUserIdByUsername(fastify, username);

  if (!userId) {
    return null;
  }

  const cursorCondition = cursor ? lt(follows.followerId, decodeCursor(cursor).id) : undefined;
  const followers = await fastify.db
    .select(publicUserFields)
    .from(follows)
    .innerJoin(users, eq(users.id, follows.followerId))
    .where(cursorCondition ? and(eq(follows.followingId, userId), cursorCondition) : eq(follows.followingId, userId))
    .orderBy(desc(follows.followerId))
    .limit(limit + 1);

  const hasNextPage = followers.length > limit;
  const items = hasNextPage ? followers.slice(0, limit) : followers;
  const lastItem = items[items.length - 1];

  return {
    items,
    nextCursor: hasNextPage && lastItem ? encodeCursor(new Date(0), lastItem.id) : null,
    hasNextPage,
  };
}

export async function getFollowing(
  fastify: FastifyInstance,
  username: string,
  { cursor, limit }: PaginationParams
) {
  const userId = await getUserIdByUsername(fastify, username);

  if (!userId) {
    return null;
  }

  const cursorCondition = cursor ? lt(follows.followingId, decodeCursor(cursor).id) : undefined;
  const following = await fastify.db
    .select(publicUserFields)
    .from(follows)
    .innerJoin(users, eq(users.id, follows.followingId))
    .where(cursorCondition ? and(eq(follows.followerId, userId), cursorCondition) : eq(follows.followerId, userId))
    .orderBy(desc(follows.followingId))
    .limit(limit + 1);

  const hasNextPage = following.length > limit;
  const items = hasNextPage ? following.slice(0, limit) : following;
  const lastItem = items[items.length - 1];

  return {
    items,
    nextCursor: hasNextPage && lastItem ? encodeCursor(new Date(0), lastItem.id) : null,
    hasNextPage,
  };
}

// 5. Mutations: Profile updates & Social graph
export async function updateProfile(
  fastify: FastifyInstance,
  userId: string,
  input: UpdateProfileInput
) {
  const [updated] = await fastify.db
    .update(users)
    .set(input)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
    });

  return updated;
}

export async function followUser(fastify: FastifyInstance, followerId: string, targetUsername: string) {
  const [target] = await fastify.db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, targetUsername));

  if (!target) {
    throw new Error('User not found');
  }

  if (target.id === followerId) {
    throw new Error('Cannot follow yourself');
  }

  await fastify.db
    .insert(follows)
    .values({ followerId, followingId: target.id })
    .onConflictDoNothing();

  return { following: true };
}

export async function unfollowUser(fastify: FastifyInstance, followerId: string, targetUsername: string) {
  const [target] = await fastify.db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, targetUsername));

  if (!target) {
    throw new Error('User not found');
  }

  await fastify.db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)));

  return { following: false };
}