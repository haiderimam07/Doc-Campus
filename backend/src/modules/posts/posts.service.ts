import { FastifyInstance } from 'fastify';
import { eq, and, desc, or, lt, inArray, sql, SQL } from 'drizzle-orm';
import { decodeCursor, encodeCursor } from '../../lib/pagination.js';
import { posts, users, follows, saves } from '../../db/schema.js';
import { CreatePostInput } from './posts.schema.js';

interface FeedQueryParams {
  cursor?: string;
  limit?: number;
}

// 1. Create a new post
export async function createPost(
  fastify: FastifyInstance,
  userId: string,
  input: CreatePostInput
) {
  const [newPost] = await fastify.db
    .insert(posts)
    .values({
      userId,
      description: input.description,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      // Links have nothing to OCR, so mark them done to keep them out of the OCR queue
      ocrStatus: input.fileType === 'link' ? 'done' : 'pending',
    })
    .returning();

  return newPost;
}

// 2. Fetch a single post by ID with author details
export async function getPostById(fastify: FastifyInstance, postId: string) {
  const [post] = await fastify.db
    .select({
      id: posts.id,
      description: posts.description,
      fileUrl: posts.fileUrl,
      fileType: posts.fileType,
      ocrStatus: posts.ocrStatus,
      ocrText: posts.ocrText,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.userId))
    .where(eq(posts.id, postId));

  return post ?? null;
}

// 3. Fetch posts by a specific username
export async function getPostsByUsername(
  fastify: FastifyInstance,
  username: string,
  { cursor, limit }: { cursor?: string; limit: number }
) {
  const user = await fastify.db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!user) return { items: [], nextCursor: null, hasNextPage: false };

  const cursorCond = cursor
    ? (() => {
        const { createdAt, id } = decodeCursor(cursor);
        return or(
          lt(posts.createdAt, createdAt),
          and(eq(posts.createdAt, createdAt), lt(posts.id, id))
        );
      })()
    : undefined;

  const userPosts = await fastify.db
    .select({
      id: posts.id,
      description: posts.description,
      fileUrl: posts.fileUrl,
      fileType: posts.fileType,
      ocrStatus: posts.ocrStatus,
      ocrText: posts.ocrText,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.userId))
    .where(cursorCond ? and(eq(posts.userId, user.id), cursorCond) : eq(posts.userId, user.id))
    .orderBy(desc(posts.createdAt), desc(posts.id))
    .limit(limit + 1);

  const hasNextPage = userPosts.length > limit;
  const items = hasNextPage ? userPosts.slice(0, limit) : userPosts;
  const lastItem = items[items.length - 1];

  return {
    items,
    nextCursor: hasNextPage && lastItem ? encodeCursor(lastItem.createdAt, lastItem.id) : null,
    hasNextPage,
  };
}

// 4. Delete a post (ensures ownership)
export async function deletePost(
  fastify: FastifyInstance,
  postId: string,
  userId: string
) {
  const [deleted] = await fastify.db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .returning({ id: posts.id });

  return !!deleted;
}

// =====================================================================
// 5. Unified Feed: everyone's posts, ranked by recency + relationship boost
// =====================================================================

// How many hours of "head start" a post gets based on your relationship
// with its author. A post from someone you follow that is 20h old still
// ranks above a stranger's post that is 5h old. Tune these numbers freely.
const RELATION_BOOST_HOURS = {
  own: 24,
  following: 24,
  follower: 12,
  friend_of_friend: 6,
} as const;

type Relation = keyof typeof RELATION_BOOST_HOURS;
export type FeedReason = Relation | 'discover';

// Who is in this user's network?
async function getNetworkIds(fastify: FastifyInstance, userId: string) {
  const [followingRows, followerRows] = await Promise.all([
    // people I follow
    fastify.db
      .select({ id: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, userId)),
    // people who follow me
    fastify.db
      .select({ id: follows.followerId })
      .from(follows)
      .where(eq(follows.followingId, userId)),
  ]);

  const followingIds = followingRows.map((row) => row.id);
  const followerIds = followerRows.map((row) => row.id);

  // friends of friends: people that the people I follow are following
  let friendOfFriendIds: string[] = [];
  if (followingIds.length > 0) {
    const rows = await fastify.db
      .selectDistinct({ id: follows.followingId })
      .from(follows)
      .where(inArray(follows.followerId, followingIds))
      .limit(500); // safety cap for very large networks
    friendOfFriendIds = rows.map((row) => row.id);
  }

  return { followingIds, followerIds, friendOfFriendIds };
}

export async function getHybridFeed(
  fastify: FastifyInstance,
  currentUserId: string | null,
  { cursor, limit = 10 }: FeedQueryParams
) {
  // 1. Work out which relationship tiers apply to this viewer.
  //    Order matters: the first matching tier wins if someone is in several.
  const tiers: { name: Relation; condition: SQL }[] = [];

  if (currentUserId) {
    const network = await getNetworkIds(fastify, currentUserId);

    tiers.push({ name: 'own', condition: eq(posts.userId, currentUserId) });
    if (network.followingIds.length > 0) {
      tiers.push({ name: 'following', condition: inArray(posts.userId, network.followingIds) });
    }
    if (network.followerIds.length > 0) {
      tiers.push({ name: 'follower', condition: inArray(posts.userId, network.followerIds) });
    }
    if (network.friendOfFriendIds.length > 0) {
      tiers.push({
        name: 'friend_of_friend',
        condition: inArray(posts.userId, network.friendOfFriendIds),
      });
    }
  }

  // 2. Build the SQL pieces (guests have no tiers, so it's plain newest-first)
  const reason = tiers.length
    ? sql<FeedReason>`case ${sql.join(
        tiers.map((tier) => sql`when ${tier.condition} then ${sql.raw(`'${tier.name}'`)}`),
        sql` `
      )} else 'discover' end`
    : sql<FeedReason>`'discover'`;

  const boostHours = tiers.length
    ? sql`case ${sql.join(
        tiers.map(
          (tier) =>
            sql`when ${tier.condition} then ${sql.raw(String(RELATION_BOOST_HOURS[tier.name]))}`
        ),
        sql` `
      )} else 0 end`
    : sql`0`;

  // "ranked time" = created_at pushed forward by the boost.
  // date_trunc to milliseconds keeps it identical to what JS Dates can hold,
  // so cursor comparisons never skip or repeat rows.
  const rankedAt = sql<Date>`date_trunc('milliseconds', ${posts.createdAt} + (${boostHours}) * interval '1 hour')`.mapWith(
    posts.createdAt
  );

  // 3. Cursor: continue strictly after the last (rankedAt, id) we returned.
  //    (decodeCursor's `createdAt` field now carries the ranked time.)
  const cursorCondition = cursor
    ? (() => {
        const { createdAt: cursorTime, id: cursorId } = decodeCursor(cursor);
        const isoTime = cursorTime.toISOString();
        return sql`(${rankedAt} < ${isoTime}::timestamp or (${rankedAt} = ${isoTime}::timestamp and ${posts.id} < ${cursorId}))`;
      })()
    : undefined;

  // 4. One query: no more "network first, global backfill" gap
  const rows = await fastify.db
    .select({
      id: posts.id,
      description: posts.description,
      fileUrl: posts.fileUrl,
      fileType: posts.fileType,
      ocrStatus: posts.ocrStatus,
      createdAt: posts.createdAt,
      author: {
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
      reason,
      rankedAt: rankedAt.as('ranked_at'),
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.userId))
    .where(cursorCondition)
    .orderBy(desc(sql`ranked_at`), desc(posts.id))
    .limit(limit + 1);

  // 5. Pagination metadata
  const hasNextPage = rows.length > limit;
  const pageRows = hasNextPage ? rows.slice(0, limit) : rows;
  const lastRow = pageRows[pageRows.length - 1];

  const nextCursor = hasNextPage && lastRow ? encodeCursor(lastRow.rankedAt, lastRow.id) : null;

  // don't leak the internal ranking timestamp to the client
  const items = pageRows.map(({ rankedAt: _rankedAt, ...post }) => post);

  return { items, nextCursor, hasNextPage };
}

// 6. Saved posts
export async function savePost(fastify: FastifyInstance, postId: string, userId: string) {
  await fastify.db.insert(saves).values({ postId, userId }).onConflictDoNothing();
  return { saved: true };
}

export async function unsavePost(fastify: FastifyInstance, postId: string, userId: string) {
  await fastify.db.delete(saves).where(and(eq(saves.postId, postId), eq(saves.userId, userId)));
  return { saved: false };
}

export async function getSavedPostIds(fastify: FastifyInstance, userId: string) {
  const records = await fastify.db
    .select({ postId: saves.postId })
    .from(saves)
    .where(eq(saves.userId, userId));
  return { items: records.map((record) => record.postId) };
}