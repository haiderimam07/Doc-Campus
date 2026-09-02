/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Path to your schema source file
  schema: './src/db/schema.ts',

  // Directory where generated SQL migration files will be placed
  out: './drizzle',

  // Database driver dialect
  dialect: 'postgresql',

  // Database connection settings
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },

  // Optional: Print verbose logging during generation/push
  verbose: true,

  // Optional: Prompt for confirmation before running dangerous operations against DB
  strict: true,
});