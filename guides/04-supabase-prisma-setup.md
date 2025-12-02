# Supabase + Prisma Setup & Troubleshooting Guide

This guide documents the specific configuration required to connect this project's Prisma backend to a Supabase PostgreSQL database, including workarounds for common issues encountered during development.

## 1. Prerequisites

- A Supabase project created at [supabase.com](https://supabase.com).
- Node.js and npm installed.

## 2. Connection String Configuration

Supabase provides two types of connection strings: **Transaction Mode** (Pooler) and **Session Mode** (Direct). For Prisma to work correctly with migrations and schema pushes, you generally need the **Direct Connection**.

### The Correct Format
In your `backend/.env` file, you need two variables. Note the specific ports and parameters:

```env
# Connect to Supabase via connection pooling with Supavisor.
# Uses port 6543 and ?pgbouncer=true flag.
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
# Uses port 5432.
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**Crucial Details:**
- **PROJECT-REF**: Your unique project ID (e.g., `xujysejaploauzmdytxi`).
- **REGION**: Your project region (e.g., `ap-northeast-1`).
- **PASSWORD**: Your database password (NOT your Supabase account password).

## 3. Common Issues & Solutions

### Issue 1: "Tenant or user not found"
**Symptoms:** `npx prisma db push` fails with this error.
**Cause:** Incorrect Project ID or Region in the connection string.
**Fix:**
1. Go to Supabase Dashboard -> Settings -> Database.
2. Verify the **Host** matches your connection string exactly.
3. Ensure you are using the correct password.

### Issue 2: PowerShell .env Corruption
**Symptoms:** Connection fails with weird characters in the hostname (e.g., `` `5432`.base.co ``) or "Environment variable not found".
**Cause:** PowerShell's handling of special characters (like `&` or `?`) when using `echo` or `Out-File` can corrupt the `.env` file encoding or content.
**Fix:** Use a Node.js script to create the `.env` file cleanly.

Create `create-env.cjs`:
```javascript
const fs = require('fs');
const envContent = `DATABASE_URL="postgresql://..."\nDIRECT_URL="postgresql://..."`;
fs.writeFileSync('.env', envContent, 'utf8');
```
Run it: `node create-env.cjs`

### Issue 3: Prisma Migration Failures
**Symptoms:** `prisma db push` or `migrate dev` hangs or fails to create tables despite correct credentials.
**Workaround:** Manually create tables via SQL.

1. Generate the SQL script:
   ```bash
   npx prisma migrate dev --name init --create-only
   ```
   (Or manually write the SQL matching your schema).
2. Go to Supabase **SQL Editor**.
3. Paste and run the SQL to create tables.
4. Run `npx prisma generate` locally to update the client.

## 4. Final Verification

1. **Generate Client:**
   ```bash
   npx prisma generate
   ```
2. **Start Backend:**
   ```bash
   npm run dev
   ```
   Ensure it says "Server running on..." without crashing.
3. **Test Application:**
   - Go to the frontend (e.g., `http://localhost:5173`).
   - Try to **Sign Up**. If successful, the database connection is fully working.

## 5. CORS Configuration (Frontend Port)
If your frontend starts on a different port (e.g., `5174` instead of `5173`), update `backend/src/index.ts` to allow it:

```typescript
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));
```
