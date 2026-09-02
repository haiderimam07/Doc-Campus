import { FastifyInstance } from 'fastify';
import { eq, and, desc, lt, inArray, notInArray } from 'drizzle-orm';
import { posts, users, follows } from '../../db/schema.js';
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
      ocrStatus: 'pending',
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
export async function getPostsByUsername(fastify: FastifyInstance, username: string) {
  return fastify.db
    .select({
      id: posts.id,
      description: posts.description,
      fileUrl: posts.fileUrl,
      fileType: posts.fileType,
      ocrStatus: posts.ocrStatus,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.userId))
    .where(eq(users.username, username))
    .orderBy(desc(posts.createdAt));
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

// 5. Unified Hybrid Feed (Followed network + Global fallback)
export async function getHybridFeed(
  fastify: FastifyInstance,
  currentUserId: string | null,
  { cursor, limit = 10 }: FeedQueryParams
) {
  const cursorCondition = cursor ? lt(posts.createdAt, new Date(cursor)) : undefined;

  let followedIds: string[] = [];

  // Get list of followed user IDs if authenticated
  if (currentUserId) {
    const followedRecords = await fastify.db
      .select({ followingId: follows.followingId })
      .from(follows)
      .where(eq(follows.followerId, currentUserId));

    followedIds = followedRecords.map((f) => f.followingId);
    followedIds.push(currentUserId); // Include own posts
  }

  let feedPosts: Array<{
    id: string;
    description: string | null;
    fileUrl: string;
    fileType: 'pdf' | 'image' | 'doc' | 'other';
    ocrStatus: 'pending' | 'processing' | 'done' | 'failed';
    createdAt: Date;
    author: {
      id: string;
      username: string;
      avatarUrl: string | null;
    };
  }> = [];

  // Step 1: Query followed network if user follows anyone
  if (followedIds.length > 0) {
    feedPosts = await fastify.db
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
      })
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .where(and(inArray(posts.userId, followedIds), cursorCondition))
      .orderBy(desc(posts.createdAt))
      .limit(limit + 1);
  }

  // Step 2: If network posts < requested limit, backfill with global posts
  if (feedPosts.length < limit + 1) {
    const existingPostIds = feedPosts.map((p) => p.id);
    const neededCount = limit + 1 - feedPosts.length;

    const globalConditions = [cursorCondition];
    if (existingPostIds.length > 0) {
      globalConditions.push(notInArray(posts.id, existingPostIds));
    }

    const globalPosts = await fastify.db
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
      })
      .from(posts)
      .innerJoin(users, eq(users.id, posts.userId))
      .where(and(...globalConditions.filter((c): c is NonNullable<typeof c> => c !== undefined)))
      .orderBy(desc(posts.createdAt))
      .limit(neededCount);

    feedPosts = [...feedPosts, ...globalPosts];
  }

  // Step 3: Compute cursor pagination metadata
  const hasNextPage = feedPosts.length > limit;
  const items = hasNextPage ? feedPosts.slice(0, limit) : feedPosts;
  const nextCursor =
    hasNextPage && items.length > 0
      ? items[items.length - 1].createdAt.toISOString()
      : null;

  return { items, nextCursor, hasNextPage };
}