import { FastifyInstance } from 'fastify';
import { eq , and } from 'drizzle-orm';
import { users, follows } from '../../db/schema.js';
import { UpdateProfileInput } from './users.schema.js';

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