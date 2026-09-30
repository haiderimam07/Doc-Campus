import { eq, sql } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { posts, shares } from '../../db/schema.js';
import { isForeignKeyViolation, notFound } from '../../lib/errors.js';
import { events } from '../../lib/events.js';
import { getPostOrThrow } from '../posts/posts.guard.js';

/**
 * A "share" here = the user copied the link / used the share sheet.
 * We log the event and bump the counter. (An in-app "repost" would be a different feature.)
 */
export async function sharePost(fastify: FastifyInstance, userId: string, postId: string) {
  const { db } = fastify;
  const post = await getPostOrThrow(db, postId);
  try {
    const shareCount = await db.transaction(async (tx) => {
      await tx.insert(shares).values({ postId, userId });
      const [p] = await tx
        .update(posts)
        .set({ shareCount: sql`${posts.shareCount} + 1` })
        .where(eq(posts.id, postId))
        .returning({ shareCount: posts.shareCount });
      return p.shareCount;
    });

    if (post.userId !== userId) {
      events.emit('post.shared', { postId, actorId: userId, postOwnerId: post.userId });
    }
    return { shareCount };
  } catch (err) {
    if (isForeignKeyViolation(err)) throw notFound('Post');
    throw err;
  }
}
