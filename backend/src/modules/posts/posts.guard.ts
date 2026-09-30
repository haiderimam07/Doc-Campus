import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { posts } from '../../db/schema.js';
import { notFound } from '../../lib/errors.js';

type Db = FastifyInstance['db'];
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];
export type Executor = Db | Tx;

/** Shared by likes/comments/shares so they never query `posts` ad hoc. Pass `fastify.db` or a `tx`. */
export async function getPostOrThrow(executor: Executor, postId: string) {
  const [post] = await executor
    .select({ id: posts.id, userId: posts.userId, commentCount: posts.commentCount })
    .from(posts)
    .where(eq(posts.id, postId));
  if (!post) throw notFound('Post');
  return post;
}
