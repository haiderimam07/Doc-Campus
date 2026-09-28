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