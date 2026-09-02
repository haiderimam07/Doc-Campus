import { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema } from './auth.schema.js';
import { registerUser, validateCredentials, issueTokens } from './auth.service.js';
import { env } from '../../config/env.js';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register', async (request, reply) => {
        const input = registerSchema.parse(request.body);
        const user = await registerUser(fastify, input);
        const { accessToken, refreshToken } = issueTokens(fastify, user.id);

        reply.setCookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 60 * 60 * 24 * 30,
        });

        return { user, accessToken };
    });

    fastify.post('/login', async (request, reply) => {
        const input = loginSchema.parse(request.body);
        const user = await validateCredentials(fastify, input);
        const { accessToken, refreshToken } = issueTokens(fastify, user.id);

        reply.setCookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 60 * 60 * 24 * 30,
        });

        return { user, accessToken };
    });

    fastify.post('/refresh', async (request, reply) => {
        const token = request.cookies.refreshToken;
        if (!token) return reply.code(401).send({ error: 'No refresh token' });

        try {
            const decoded = fastify.jwt.verify<{
                sub?: string;
                type?: string;
            }>(token, {
                key: env.JWT_REFRESH_SECRET,
            });

            if (decoded.type !== 'refresh' || !decoded.sub) {
                return reply.code(401).send({
                    error: 'Invalid refresh token',
                });
            }
            const { accessToken } = issueTokens(fastify, (decoded as any).sub);
            return { accessToken };
        } catch {
            return reply.code(401).send({ error: 'Invalid or expired refresh token' });
        }
    });

    fastify.post('/logout', async (request, reply) => {
        reply.clearCookie('refreshToken', { path: '/auth/refresh' });
        return { success: true };
    });
}