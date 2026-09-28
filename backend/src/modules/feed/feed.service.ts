import { FastifyInstance } from 'fastify';
import { eq, desc, inArray, sql, SQL } from 'drizzle-orm';
import { decodeCursor, encodeCursor } from '../../lib/pagination.js';
import { posts, users } from '../../db/schema.js';
import { getNetwork } from '../social-graph/social-graph.service.js';
import { RELATION_BOOST_HOURS, Relation, FeedReason } from './feed.config.js';

interface FeedQueryParams {
  cursor?: string;
  limit?: number;
}

// Unified feed: everyone's posts, ranked by recency + relationship boost
export async function getHybridFeed(
  fastify: FastifyInstance,
  currentUserId: string | null,
  { cursor, limit = 10 }: FeedQueryParams
) {
  // 1. Work out which relationship tiers apply to this viewer.
  //    Order matters: the first matching tier wins if someone is in several.
  const tiers: { name: Relation; condition: SQL }[] = [];

  if (currentUserId) {
    const network = await getNetwork(fastify, currentUserId);

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

  // 4. One query, no "network first, global backfill" gap
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