# UMVP Frontend and API

This directory contains the current Vite + React frontend and its Express development API server.

## Run locally

Prerequisite: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run dev` runs `frontend/server.ts`, which serves the Vite UI and the `/api` routes from the same origin.

The optional AI assistant uses `GEMINI_API_KEY`. Without that key, the server returns its built-in response fallback:

```env
GEMINI_API_KEY="your-key"
```

## View the database

1. Open the **Controller Portal** from the header.
2. Sign in as Controller/Admin when prompted.
3. Open the **PostgreSQL DB** tab.
4. Use **Live PostgreSQL Table Browser** to select a table, search rows, refresh, or copy the displayed SQL query.

The browser reads `/api/database/tables/:tableName` and supports `applications`, `certificates`, `audit_ledger`, `users`, and `e2ee_messages`. The connection status is available at `/api/database/status`.

The frontend database pool uses these environment variables when PostgreSQL is configured:

```env
SQL_HOST="localhost"
SQL_USER="postgres"
SQL_PASSWORD="your-password"
SQL_DB_NAME="umvp"
```

If the PostgreSQL connection fails, the API intentionally returns a standby in-memory view for the prototype. Changes made in standby mode are not persisted.

## Useful commands

```bash
npm run lint       # TypeScript check
npm run build      # Build the frontend and bundled server
npm run preview    # Preview the Vite build only
```

To use Prisma Studio for the separate root Prisma schema, run `npm run db:studio` from the repository root. That requires a valid root `.env` `DATABASE_URL`; an invalid password produces Prisma error `P1000`.
