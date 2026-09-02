import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: NodePgDatabase<typeof schema>;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }, // Neon requires SSL
    max: 10, // keep small — Neon free tier has a connection limit
  });

  const db = drizzle(pool, { schema });

  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    await pool.end();
  });
});