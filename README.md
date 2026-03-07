# Next.js + Postgres + Prisma

Single Next.js app with PostgreSQL and Prisma: API routes, Server Components for data, and Docker Compose for local dev.

## Stack

- **Next.js 15** (App Router)
- **PostgreSQL** (database)
- **Prisma** (ORM, migrations, type-safe client)
- **Docker Compose** (app + Postgres)

## Quick start with Docker

```bash
docker compose up --build
```

- App: http://localhost:3000  
- Postgres: `localhost:5432` (user `postgres`, password `admin`, db `prisma`)

The app runs `prisma db push` on startup so the schema is applied automatically.

## Local development (no Docker)

1. **Postgres** running locally (or use Docker for Postgres only):

   ```bash
   docker run -d --name postgres -p 5432:5432 \
     -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=prisma \
     postgres:16-alpine
   ```

2. **Env** – copy and edit:

   ```bash
   cd frontend && cp .env.example .env
   ```

3. **Install and DB**:

   ```bash
   cd frontend
   npm install
   npx prisma db push
   npm run dev
   ```

4. Open http://localhost:3000

## Scripts (frontend)

| Script            | Description                |
|-------------------|----------------------------|
| `npm run dev`     | Start Next.js dev server   |
| `npm run build`   | Generate Prisma client + build Next.js |
| `npm run start`   | Start production server    |
| `npx prisma studio` | Open Prisma Studio     |
| `npx prisma migrate dev` | Create and run migrations |

## Project layout

- `frontend/` – Next.js app (only app in the repo)
  - `app/api/` – API routes (products, categories)
  - `app/` – Pages (products, categories, create forms)
  - `lib/db.ts` – Prisma client singleton
  - `lib/data.ts` – Server-side data helpers (used by Server Components)
  - `prisma/schema.prisma` – Schema and migrations

The previous Express backend has been replaced by Next.js API routes and server-side Prisma in the same app.
