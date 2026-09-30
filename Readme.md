# 📚 DocCampus

DocCampus is a full-stack document and study resource-sharing platform designed for students and professionals to collaborate, share resources, engage in multi-level threaded discussions, and manage academic content seamlessly.

---

## 🛠 Tech Stack

### **Backend**
* **Framework:** Fastify (TypeScript)
* **ORM:** Drizzle ORM
* **Database:** PostgreSQL (Neon)
* **Storage:** Cloudflare R2 (Object Storage)
* **Authentication:** JWT (Access/Refresh tokens) with Secure Cookies

### **Frontend**
* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS
* **Package Manager:** pnpm (Monorepo Workspace setup)

---

## 📂 Project Structure

```text
myproject/
├── Readme.md
├── backend
│   ├── drizzle
│   │   ├── 0000_many_sunspot.sql
│   │   ├── 0001_add_follow_pagination_index.sql
│   │   ├── 0002_repair_saves_table.sql
│   │   ├── 0003_messy_earthquake.sql
│   │   └── meta
│   │       ├── 0000_snapshot.json
│   │       ├── 0003_snapshot.json
│   │       └── _journal.json
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── src
│   │   ├── app.ts
│   │   ├── config
│   │   │   └── env.ts
│   │   ├── db
│   │   │   └── schema.ts
│   │   ├── lib
│   │   │   ├── auth.ts
│   │   │   ├── common.schema.ts
│   │   │   ├── cursor.ts
│   │   │   ├── errors.ts
│   │   │   ├── events.ts
│   │   │   ├── pagination.ts
│   │   │   ├── upload.ts
│   │   │   └── validate.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   ├── comments
│   │   │   ├── feed
│   │   │   ├── likes
│   │   │   ├── posts
│   │   │   ├── shares
│   │   │   ├── social-graph
│   │   │   └── users
│   │   ├── plugins
│   │   │   ├── auth.ts
│   │   │   └── db.ts
│   │   ├── server.ts
│   │   └── types
│   │       └── fastify.d.ts
│   └── tsconfig.json
└── frontend
    ├── LICENSE
    ├── README.md
    ├── app
    │   ├── (dashboard)
    │   ├── (login)
    │   │   ├── actions.ts
    │   │   ├── login.tsx
    │   │   ├── sign-in
    │   │   └── sign-up
    │   ├── favicon.ico
    │   ├── feed
    │   │   ├── [postId]
    │   │   └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   ├── page.tsx
    │   ├── profile
    │   │   ├── [username]
    │   │   ├── edit
    │   │   └── page.tsx
    │   └── saved
    │       └── page.tsx
    ├── components
    │   ├── avatar.tsx
    │   ├── comments-sections.tsx
    │   ├── connections-panel.tsx
    │   ├── doc-campus-shell.tsx
    │   ├── feed-profile-summary.tsx
    │   ├── feed-right-rail.tsx
    │   ├── navbar.tsx
    │   ├── post-card.tsx
    │   ├── post-composer.tsx
    │   ├── profile-editor.tsx
    │   └── ui
    ├── components.json
    ├── drizzle.config.ts
    ├── lib
    │   ├── auth
    │   ├── db
    │   ├── doc-campus-api.ts
    │   ├── format.ts
    │   ├── ui.ts
    │   └── utils.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── postcss.config.mjs
    ├── proxy.ts
    └── tsconfig.json
```

## ⚙️ Environment Variables Configuration

Create a `.env` file (or `.env.local`) inside your `backend` directory and configure the variables as shown below:

```env
NODE_ENV=development
PORT=4000
POSTGRES_URL=neon_db_postgres_URL
JWT_SECRET=random generated secret
COOKIE_SECRET=random generated secret

JWT_ACCESS_SECRET=random generated secret
JWT_REFRESH_SECRET=random generated secret

R2_ACCOUNT_ID=cloudfare
R2_ACCESS_KEY_ID=cloudfare
R2_SECRET_ACCESS_KEY=cloudfare
R2_BUCKET_NAME=app_name
R2_PUBLIC_DOMAIN=cloudfare

Token_Value=random generated secret

```

## Installation & Getting Started Guide

### Prerequisites
Make sure you have the following installed on your machine:
* Node.js (v18 or higher)
* pnpm package manager

### Step 1: Clone the Repository
```bash
git clone [https://github.com/your-username/myproject.git](https://github.com/your-username/myproject.git)
cd myproject

### Step 2: Configure Environment Variables
Create and configure your `.env` file inside the `backend` directory using the template provided above.
```


### Step 3: Run the Backend Server
Open your first terminal tab, navigate to the backend, install dependencies, and run the development server:

```bash
cd backend
pnpm install
pnpm dev
```

### Step 4: Run the Frontend Application
Open a second terminal tab, navigate to the frontend, install dependencies, and run the development server:

```bash
cd frontend
pnpm install
pnpm dev
```

### 📦 Database Migrations (Drizzle ORM)
To push schema changes and synchronize your PostgreSQL database tables via Drizzle Kit:

```bash
cd backend
pnpm drizzle-kit push
```