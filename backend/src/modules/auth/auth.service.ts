import bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { users } from '../../db/schema.js';
import { FastifyInstance } from 'fastify';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { env } from '../../config/env.js';

const SALT_ROUNDS = 12;

export async function registerUser(fastify: FastifyInstance, input: RegisterInput) {
  const existing = await fastify.db
    .select()
    .from(users)
    .where(or(eq(users.email, input.email), eq(users.username, input.username)))
    .limit(1);

  if (existing.length > 0) {
    throw { statusCode: 409, message: 'Email or username already in use' };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const [user] = await fastify.db
    .insert(users)
    .values({
      username: input.username,
      email: input.email,
      passwordHash,
    })
    .returning({ id: users.id, username: users.username, email: users.email });

  return user;
}

export async function validateCredentials(fastify: FastifyInstance, input: LoginInput) {
  const [user] = await fastify.db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) throw { statusCode: 401, message: 'Invalid credentials' };

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw { statusCode: 401, message: 'Invalid credentials' };

  return { id: user.id, username: user.username, email: user.email };
}

export function issueTokens(fastify: FastifyInstance, userId: string) {
  const accessToken = fastify.jwt.sign(
    { sub: userId },
    { expiresIn: env.JWT_ACCESS_EXPIRES }
  );
  const refreshToken = fastify.jwt.sign(
    { sub: userId, type: 'refresh' },
    { key: env.JWT_REFRESH_SECRET, expiresIn: env.JWT_REFRESH_EXPIRES }
  );
  return { accessToken, refreshToken };
}