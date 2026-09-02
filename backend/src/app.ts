import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { env } from './config/env.js';
import dbPlugin from './plugins/db.js';
import authPlugin from './plugins/auth.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import postsRoutes from './modules/posts/posts.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : true,
  });

  // Core Plugins
  app.register(dbPlugin);
  app.register(authPlugin);

  // File Multipart Parsing (20MB file size limit)
  app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  });

  // CORS Configuration
  app.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Cookie Support
  app.register(cookie, {
    secret: env.COOKIE_SECRET,
  });

  // Application Routes
  app.register(authRoutes, { prefix: '/auth' });
  app.register(usersRoutes, { prefix: '/api/users' });
  app.register(postsRoutes, { prefix: '/api/posts' });

  // Health Check
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  return app;
}