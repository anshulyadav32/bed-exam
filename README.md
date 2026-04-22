# B.Ed Exam Hub (React + Next.js + PostgreSQL)

This app uses a Vite frontend and a Next.js backend (API routes) with PostgreSQL for data.

## Project structure
- Frontend source: `frontend/`
- Backend source: `backend/` (Next.js API routes under `backend/app/api`)
- Frontend build output: `dist/`

## 1) Install PostgreSQL + psql
- Install PostgreSQL from the official installer for Windows.
- Ensure **Command Line Tools** are selected during setup.
- Add PostgreSQL `bin` folder to your PATH if `psql` is not found.

## 2) Create database with psql

```powershell
psql -U postgres -c "CREATE DATABASE bed_exam;"
```

## 3) Configure environment

Keep runtime env files only in `env/`:
- `env/.env.development` for local development
- `env/.env.production` for production-style local runs
- `env/.env.example` as the template

Example values:

```env
API_PORT=4000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=bed_exam
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bed_exam
```

Backend scripts are configured to load env values from `env/` only.

## 4) Install dependencies

```powershell
npm install
```

## 5) Run migrations

```powershell
npm run migrate
```

## 6) Run backend and frontend

Terminal 1:
```powershell
npm run dev:api
```

Terminal 2:
```powershell
npm run dev
```

Open the Vite URL shown in terminal (usually http://localhost:5173).

## Migration system
- Prisma schema lives in `db/prisma/schema.prisma`.
- `npm run migrate` runs `prisma db push` against the Next.js backend schema.
- API startup also performs migration/seed checks via `backend/lib/startup.js`.

## API endpoints (served by Next.js)
- `GET /api/health`
- `GET /api/scores`
- `POST /api/scores`

## Docker (One Command)

If you prefer not to install `psql` locally, run the full stack with Docker:

```powershell
docker compose up --build
```

This starts:
- Web app on http://localhost:5173
- Next.js app (UI + API) on http://localhost:3000
- PostgreSQL on port 5433

Prisma schema sync/seed runs from the Next.js app startup flow.

To stop:

```powershell
docker compose down
```

To stop and remove database volume too:

```powershell
docker compose down -v
```

