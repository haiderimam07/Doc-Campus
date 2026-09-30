import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { commentLikes, comments, likes, posts, users } from '../../db/schema.js';
import { decodeCursor, toPage } from '../../lib/cursor.js';
import { isForeignKeyViolation, notFound } from '../../lib/errors.js';
import { events } from '../../lib/events.js';
import { getPostOrThrow } from '../posts/posts.guard.js';

/* ───────────── Post likes ───────────── */

export async function likePost(fastify: FastifyInstance, userId: string, postId: string) {
  const { db } = fastify;
  const post = await getPostOrThrow(db, postId);
  try {
    const result = await db.transaction(async (tx) => {
      // Idempotent: a double click / retry inserts nothing and must NOT bump the counter.
      const inserted = await tx
        .insert(likes)
        .values({ postId, userId })
        .onConflictDoNothing()
        .returning({ postId: likes.postId });

      if (inserted.length === 0) {
        const [p] = await tx.select({ likeCount: posts.likeCount }).from(posts).where(eq(posts.id, postId));
        return { created: false, likeCount: p?.likeCount ?? 0 };
      }
      const [p] = await tx
        .update(posts)
        .set({ likeCount: sql`${posts.likeCount} + 1` })
        .where(eq(posts.id, postId))
        .returning({ likeCount: posts.likeCount });
      return { created: true, likeCount: p.likeCount };
    });

    if (result.created && post.userId !== userId) {
      events.emit('post.liked', { postId, actorId: userId, postOwnerId: post.userId });
    }
    return { liked: true, likeCount: result.likeCount };
  } catch (err) {
    if (isForeignKeyViolation(err)) throw notFound('Post');
    throw err;
  }
}

export async function unlikePost(fastify: FastifyInstance, userId: string, postId: string) {
  const { db } = fastify;
  await getPostOrThrow(db, postId);
  const likeCount = await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .returning({ postId: likes.postId });

    if (deleted.length === 0) {
      const [p] = await tx.select({ likeCount: posts.likeCount }).from(posts).where(eq(posts.id, postId));
      return p?.likeCount ?? 0;
    }
    const [p] = await tx
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} - 1` })
      .where(eq(posts.id, postId))
      .returning({ likeCount: posts.likeCount });
    return p.likeCount;
  });
  return { liked: false, likeCount };
}

/** "Who liked this post", newest first, keyset paginated. */
export async function listPostLikers(fastify: FastifyInstance, postId: string, q: { cursor?: string; limit: number }) {
  const { db } = fastify;
  await getPostOrThrow(db, postId);
  const cursor = decodeCursor(q.cursor);

  const rows = await db
    .select({
      userId: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
      cursorTs: sql<string>`${likes.createdAt}::text`,
    })
    .from(likes)
    .innerJoin(users, eq(users.id, likes.userId))
    .where(
      and(
        eq(likes.postId, postId),
        cursor ? sql`(${likes.createdAt}, ${likes.userId}) < (${cursor.ts}::timestamptz, ${cursor.id}::uuid)` : undefined
      )
    )
    .orderBy(desc(likes.createdAt), desc(likes.userId))
    .limit(q.limit + 1);

  const page = toPage(rows, q.limit, (r) => ({ ts: r.cursorTs, id: r.userId }));
  return {
    items: page.items.map((r) => ({ id: r.userId, username: r.username, avatarUrl: r.avatarUrl })),
    hasMore: page.hasMore,
    nextCursor: page.nextCursor,
  };
}

/** Batch lookup for feeds: ONE query for a whole page of posts (avoids N+1). */
export async function getLikedPostIds(fastify: FastifyInstance, userId: string, postIds: string[]): Promise<Set<string>> {
  const { db } = fastify;
  if (postIds.length === 0) return new Set();
  const rows = await db
    .select({ postId: likes.postId })
    .from(likes)
    .where(and(eq(likes.userId, userId), inArray(likes.postId, postIds)));
  return new Set(rows.map((r) => r.postId));
}

/* ───────────── Comment likes ───────────── */

async function getLiveComment(db: FastifyInstance['db'], commentId: string) {
  const [c] = await db
    .select({ id: comments.id, postId: comments.postId, userId: comments.userId })
    .from(comments)
    .where(and(eq(comments.id, commentId), isNull(comments.deletedAt)));
  if (!c) throw notFound('Comment');
  return c;
}

export async function likeComment(fastify: FastifyInstance, userId: string, commentId: string) {
  const { db } = fastify;
  const comment = await getLiveComment(db, commentId);
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(commentLikes)
        .values({ commentId, userId })
        .onConflictDoNothing()
        .returning({ commentId: commentLikes.commentId });

      if (inserted.length === 0) {
        const [c] = await tx.select({ likeCount: comments.likeCount }).from(comments).where(eq(comments.id, commentId));
        return { created: false, likeCount: c?.likeCount ?? 0 };
      }
      const [c] = await tx
        .update(comments)
        .set({ likeCount: sql`${comments.likeCount} + 1` })
        .where(eq(comments.id, commentId))
        .returning({ likeCount: comments.likeCount });
      return { created: true, likeCount: c.likeCount };
    });

    if (result.created && comment.userId !== userId) {
      events.emit('comment.liked', {
        commentId,
        postId: comment.postId,
        actorId: userId,
        commentAuthorId: comment.userId,
      });
    }
    return { liked: true, likeCount: result.likeCount };
  } catch (err) {
    if (isForeignKeyViolation(err)) throw notFound('Comment');
    throw err;
  }
}

export async function unlikeComment(fastify: FastifyInstance, userId: string, commentId: string) {
  const { db } = fastify;
  await getLiveComment(db, commentId);
  const likeCount = await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)))
      .returning({ commentId: commentLikes.commentId });

    if (deleted.length === 0) {
      const [c] = await tx.select({ likeCount: comments.likeCount }).from(comments).where(eq(comments.id, commentId));
      return c?.likeCount ?? 0;
    }
    const [c] = await tx
      .update(comments)
      .set({ likeCount: sql`${comments.likeCount} - 1` })
      .where(eq(comments.id, commentId))
      .returning({ likeCount: comments.likeCount });
    return c.likeCount;
  });
  return { liked: false, likeCount };
}
