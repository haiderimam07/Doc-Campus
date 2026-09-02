# SaaS Application Starter

This repository contains a full-stack SaaS application split into two independently runnable TypeScript applications:

- `frontend/` is a Next.js web application with authentication, a protected dashboard, team management, activity views, pricing, Stripe payments, and a local Drizzle database layer.
- `backend/` is a Fastify API with PostgreSQL access, cookie and JWT authentication, and user/authentication routes. Its schema also provides the foundation for posts, file uploads, OCR status, tags, follows, comments, likes, and saves.

The frontend currently runs on port `3000`; the backend defaults to port `4000`.

## Technology

### Frontend

- Next.js 15 and React 19
- TypeScript
- Tailwind CSS and Radix UI primitives
- Drizzle ORM with PostgreSQL
- Cookie-based sessions and server actions
- Stripe subscription and checkout integration
- SWR for client-side data fetching

### Backend

- Fastify 5
- TypeScript with `tsx` for development
- PostgreSQL with Drizzle ORM
- Zod environment validation
- JWT access and refresh tokens
- Secure cookies and CORS

## Repository Structure

```text
.
├── Readme.md                         # Project overview and setup guide
├── frontend/                         # Next.js web application
│   ├── app/
│   │   ├── (login)/                  # Sign-in/sign-up pages and actions
│   │   ├── (dashboard)/              # Protected dashboard, settings, and pricing
│   │   ├── api/                      # Next.js route handlers
│   │   ├── components/ui/            # Shared UI components
│   │   ├── lib/auth/                 # Session and action-validation helpers
│   │   ├── lib/db/                   # Drizzle client, schema, queries, seed, migrations
│   │   └── lib/payments/              # Stripe actions and integration
│   ├── proxy.ts                      # Request proxy/middleware entry point
│   ├── drizzle.config.ts             # Frontend Drizzle configuration
│   └── package.json                  # Frontend scripts and dependencies
└── backend/                          # Fastify API service
	├── src/
	│   ├── app.ts                    # Fastify app construction and route registration
	│   ├── server.ts                 # API process entry point
	│   ├── config/env.ts             # Validated backend environment variables
	│   ├── db/schema.ts              # Backend database tables and relations
	│   ├── modules/auth/             # Authentication routes, schemas, and services
	│   ├── modules/users/             # User routes, schemas, and services
	│   ├── plugins/auth.ts            # JWT/auth plugin
	│   ├── plugins/db.ts              # Database plugin
	│   └── types/                    # Fastify type augmentation
	├── drizzle/                       # Backend migrations and migration metadata
	├── drizzle.config.ts              # Backend Drizzle configuration
	└── package.json                  # Backend scripts and dependencies
```

## Prerequisites

- Node.js compatible with the versions used by the installed dependencies
- `pnpm` 11 or newer
- A PostgreSQL database
- Stripe account and Stripe CLI only when testing payments or webhooks

## Installation

Install dependencies separately for each application:

```bash
cd frontend
pnpm install

cd ../backend
pnpm install
```

## Configuration

Create `frontend/.env` for the Next.js application. The frontend setup and payment code expect the database, session, and Stripe values used by the files under `frontend/lib`:

```dotenv
POSTGRES_URL=postgres://user:password@localhost:5432/database
AUTH_SECRET=replace-with-a-long-random-secret
BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Stripe price IDs are selected by the pricing flow and passed to Stripe at checkout; they are not currently read from an environment variable.

Create `backend/.env` with the variables validated by `backend/src/config/env.ts`:

```dotenv
NODE_ENV=development
PORT=4000
POSTGRES_URL=postgres://user:password@localhost:5432/database
JWT_SECRET=replace-with-a-long-random-secret
COOKIE_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_SECRET=replace-with-at-least-32-characters
JWT_REFRESH_SECRET=replace-with-at-least-32-characters
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
```

Keep frontend and backend database URLs aligned when both services should use the same database. Never commit real secrets.

## Database Setup

From `frontend/`, create or update the frontend database:

```bash
pnpm db:setup
pnpm db:migrate
pnpm db:seed
```

Useful frontend database commands:

```bash
pnpm db:generate
pnpm db:studio
```

The backend has its own Drizzle configuration and migration directory. Generate and apply backend migrations from `backend/` with the Drizzle CLI as needed:

```bash
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit migrate
```

Because the applications currently maintain separate schema and migration directories, review both schemas before changing shared database tables.

## Running Locally

Start the backend in one terminal:

```bash
cd backend
pnpm dev
```

Start the frontend in another terminal:

```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The backend health check is available at [http://localhost:4000/health](http://localhost:4000/health).

### Backend Routes

- `GET /health` returns `{ "status": "ok" }`.
- `/auth` contains authentication routes.
- `/api/users` contains user routes.

The backend CORS configuration allows credentialed requests from `http://localhost:3000` during local development.

### Stripe Webhooks

After installing and authenticating the Stripe CLI, forward local events to the frontend webhook route:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Production Checklist

1. Set production database URLs and strong session/JWT secrets.
2. Configure Stripe production keys, price IDs, and a production webhook endpoint.
3. Set `BASE_URL` to the deployed frontend URL.
4. Build and start the frontend with `pnpm build` and `pnpm start`.
5. Run the backend with a production process manager and set `NODE_ENV=production`.
6. Restrict backend CORS to the deployed frontend origin.

## Development Notes

- Frontend authentication and team workflows live in `frontend/app/(login)`, `frontend/app/(dashboard)`, and `frontend/lib/auth`.
- Frontend API handlers are under `frontend/app/api`.
- Backend features follow a module structure: routes, validation schemas, and services are grouped under `backend/src/modules`.
- Database changes should be made through Drizzle migrations rather than editing generated SQL manually.
