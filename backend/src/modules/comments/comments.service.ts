import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { commentLikes, comments, posts, users } from '../../db/schema.js';
import { decodeCursor, toPage } from '../../lib/cursor.js';
import { forbidden, isForeignKeyViolation, notFound } from '../../lib/errors.js';
import { events } from '../../lib/events.js';
import { getPostOrThrow } from '../posts/posts.guard.js';
import type { CreateCommentInput } from './comments.schema.js';

/**
 * One SELECT shape for every comment read (list, replies, single).
 * Author is joined and `likedByMe` is an EXISTS subquery, so a page of N comments = ONE query.
 * `cursorTs` is the timestamp as text (microsecond precision) for keyset pagination.
 */
type Db = FastifyInstance['db'];

function baseSelect(db: Db, viewerId: string) {
  return db
    .select({
      id: comments.id,
      postId: comments.postId,
      parentId: comments.parentId,
      body: comments.body,
      likeCount: comments.likeCount,
      replyCount: comments.replyCount,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      deletedAt: comments.deletedAt,
      cursorTs: sql<string>`${comments.createdAt}::text`,
      likedByMe: sql<boolean>`EXISTS (
        SELECT 1 FROM ${commentLikes}
        WHERE ${commentLikes.commentId} = ${comments.id} AND ${commentLikes.userId} = ${viewerId}
      )`,
      authorId: users.id,
      authorUsername: users.username,
      authorAvatarUrl: users.avatarUrl,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.userId));
}

type Row = Awaited<ReturnType<typeof baseSelect>>[number];

function toDto(r: Row, viewerId: string) {
  const isDeleted = r.deletedAt !== null;
  return {
    id: r.id,
    postId: r.postId,
    parentId: r.parentId,
    // A deleted top-level comment that still has replies is shown as a "deleted" placeholder.
    body: isDeleted ? null : r.body,
    isDeleted,
    author: isDeleted ? null : { id: r.authorId, username: r.authorUsername, avatarUrl: r.authorAvatarUrl },
    likeCount: r.likeCount,
    replyCount: r.replyCount,
    likedByMe: isDeleted ? false : r.likedByMe,
    isMine: !isDeleted && r.authorId === viewerId,
    createdAt: r.createdAt,
    editedAt: r.updatedAt,
  };
}

async function getCommentDto(db: Db, commentId: string, viewerId: string) {
  const [row] = await baseSelect(db, viewerId).where(eq(comments.id, commentId));
  if (!row) throw notFound('Comment');
  return toDto(row, viewerId);
}

/* ───────────── Read ───────────── */

/** Top-level comments of a post: newest first, 5 per page by default. */
export async function listComments(fastify: FastifyInstance, viewerId: string, postId: string, q: { cursor?: string; limit: number }) {
  const { db } = fastify;
  const post = await getPostOrThrow(db, postId);
  const cursor = decodeCursor(q.cursor);

  const rows = await baseSelect(db, viewerId)
    .where(
      and(
        eq(comments.postId, postId),
        isNull(comments.parentId),
        cursor
          ? sql`(${comments.createdAt}, ${comments.id}) < (${cursor.ts}::timestamptz, ${cursor.id}::uuid)`
          : undefined
      )
    )
    .orderBy(desc(comments.createdAt), desc(comments.id))
    .limit(q.limit + 1);

  const page = toPage(rows, q.limit, (r) => ({ ts: r.cursorTs, id: r.id }));
  return {
    items: page.items.map((r) => toDto(r, viewerId)),
    hasMore: page.hasMore,
    nextCursor: page.nextCursor,
    totalCount: post.commentCount, // for the "12 comments" label (includes replies)
    canModerate: post.userId === viewerId, // post owner may delete any comment
  };
}

/** Replies of one comment: oldest first (conversation order), 3 per page by default. */
export async function listReplies(fastify: FastifyInstance, viewerId: string, commentId: string, q: { cursor?: string; limit: number }) {
  const { db } = fastify;
  const [parent] = await db
    .select({ id: comments.id, postId: comments.postId, parentId: comments.parentId })
    .from(comments)
    .where(eq(comments.id, commentId));
  if (!parent || parent.parentId !== null) throw notFound('Comment'); // only top-level comments have replies

  const post = await getPostOrThrow(db, parent.postId);
  const cursor = decodeCursor(q.cursor);

  const rows = await baseSelect(db, viewerId)
    .where(
      and(
        eq(comments.parentId, commentId),
        cursor
          ? sql`(${comments.createdAt}, ${comments.id}) > (${cursor.ts}::timestamptz, ${cursor.id}::uuid)`
          : undefined
      )
    )
    .orderBy(asc(comments.createdAt), asc(comments.id))
    .limit(q.limit + 1);

  const page = toPage(rows, q.limit, (r) => ({ ts: r.cursorTs, id: r.id }));
  return {
    items: page.items.map((r) => toDto(r, viewerId)),
    hasMore: page.hasMore,
    nextCursor: page.nextCursor,
    canModerate: post.userId === viewerId,
  };
}

/* ───────────── Write ───────────── */

export async function createComment(fastify: FastifyInstance, userId: string, postId: string, input: CreateCommentInput) {
  const { db } = fastify;
  const post = await getPostOrThrow(db, postId);

  try {
    const { commentId, parentAuthorId } = await db.transaction(async (tx) => {
      let rootId: string | null = null;
      let rootAuthorId: string | null = null;

      if (input.parentId) {
        const [target] = await tx
          .select({ id: comments.id, postId: comments.postId, parentId: comments.parentId })
          .from(comments)
          .where(eq(comments.id, input.parentId));
        if (!target || target.postId !== postId) throw notFound('Comment');

        // Threads are one level deep: replying to a reply attaches to the same top-level comment.
        rootId = target.parentId ?? target.id;

        // Atomic "parent must still exist and not be deleted" + reply counter bump.
        const [root] = await tx
          .update(comments)
          .set({ replyCount: sql`${comments.replyCount} + 1` })
          .where(and(eq(comments.id, rootId), eq(comments.postId, postId), isNull(comments.deletedAt)))
          .returning({ userId: comments.userId });
        if (!root) throw notFound('Comment');
        rootAuthorId = root.userId;
      }

      const [created] = await tx
        .insert(comments)
        .values({ postId, userId, parentId: rootId, body: input.body })
        .returning({ id: comments.id });

      await tx
        .update(posts)
        .set({ commentCount: sql`${posts.commentCount} + 1` })
        .where(eq(posts.id, postId));

      return { commentId: created.id, parentAuthorId: rootAuthorId };
    });

    events.emit('comment.created', {
      commentId,
      postId,
      actorId: userId,
      postOwnerId: post.userId,
      parentAuthorId,
    });
    return getCommentDto(db, commentId, userId);
  } catch (err) {
    if (isForeignKeyViolation(err)) throw notFound('Post');
    throw err;
  }
}

export async function updateComment(fastify: FastifyInstance, userId: string, commentId: string, body: string) {
  const { db } = fastify;
  const [existing] = await db
    .select({ userId: comments.userId, deletedAt: comments.deletedAt })
    .from(comments)
    .where(eq(comments.id, commentId));
  if (!existing || existing.deletedAt) throw notFound('Comment');
  if (existing.userId !== userId) throw forbidden('Only the author can edit a comment');

  await db.update(comments).set({ body, updatedAt: new Date() }).where(eq(comments.id, commentId));
  return getCommentDto(db, commentId, userId);
}

/**
 * Delete rules:
 *  - allowed for the comment author OR the post owner
 *  - top-level comment WITH replies  -> soft delete (placeholder), replies stay
 *  - anything else                   -> hard delete, counters fixed in the same transaction
 *  - when the last reply of a placeholder goes, the placeholder is removed too
 */
export async function deleteComment(fastify: FastifyInstance, userId: string, commentId: string) {
  const { db } = fastify;
  await db.transaction(async (tx) => {
    const [c] = await tx
      .select({
        id: comments.id,
        postId: comments.postId,
        parentId: comments.parentId,
        userId: comments.userId,
        replyCount: comments.replyCount,
        deletedAt: comments.deletedAt,
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .for('update');
    if (!c || c.deletedAt) throw notFound('Comment');

    if (c.userId !== userId) {
      const post = await getPostOrThrow(tx, c.postId);
      if (post.userId !== userId) throw forbidden('Only the author or the post owner can delete this comment');
    }

    if (c.parentId === null && c.replyCount > 0) {
      await tx.update(comments).set({ deletedAt: new Date() }).where(eq(comments.id, c.id));
    } else {
      await tx.delete(comments).where(eq(comments.id, c.id));

      if (c.parentId) {
        const [parent] = await tx
          .update(comments)
          .set({ replyCount: sql`${comments.replyCount} - 1` })
          .where(eq(comments.id, c.parentId))
          .returning({ replyCount: comments.replyCount, deletedAt: comments.deletedAt });

        if (parent && parent.deletedAt && parent.replyCount === 0) {
          await tx.delete(comments).where(eq(comments.id, c.parentId)); // orphan placeholder cleanup
        }
      }
    }

    await tx
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} - 1` })
      .where(eq(posts.id, c.postId));
  });

  return { deleted: true };
}
