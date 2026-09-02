import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { env } from './config/env.js';
import dbPlugin from './plugins/db.js';
import authPlugin from './plugins/auth.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : true,
  });

  app.register(dbPlugin);
  app.register(authPlugin);
  app.register(authRoutes, { prefix: '/auth' });
  app.register(usersRoutes, { prefix: '/api/users' });

  app.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  return app;
}