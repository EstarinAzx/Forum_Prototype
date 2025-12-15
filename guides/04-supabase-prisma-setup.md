# Supabase & Prisma Setup Guide

This guide explains how to connect the forum backend to a Supabase PostgreSQL database using Prisma.

## 1. Create Supabase Project

1.  Log in to [Supabase](https://supabase.com/).
2.  Create a new project.
3.  **Important:** Note down your database password.

## 2. Get Connection String

1.  Go to **Project Settings** -> **Database**.
2.  Under **Connection parameters**, find your **Host** (e.g., `db.abcdefg.supabase.co`) and **User** (`postgres`).
3.  Construct your **Direct Connection String**:
    ```
    postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres
    ```
    *   Replace `[YOUR-PASSWORD]` with your actual password.
    *   Replace `[HOST]` with your project's host address.
    *   **Note:** We use port `5432` for the direct connection, which works best for Prisma migrations and general usage in this setup.

## 3. Configure Backend

1.  Navigate to the `backend` directory.
2.  Create or update the `.env` file:
    ```env
    DATABASE_URL="postgresql://postgres:yourpassword@db.projectref.supabase.co:5432/postgres"
    JWT_SECRET="your-secret-key"
    FRONTEND_URL="http://localhost:5173"
    ```

## 4. Configure Prisma Schema

Ensure your `prisma/schema.prisma` uses the direct connection:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 5. Initialize Database

Run the following command to create the tables in your Supabase database:

```bash
npx prisma db push
```

If this command fails (e.g., due to connection timeouts or specific Supabase restrictions), you can manually create the tables using the SQL Editor in Supabase.

## 6. Generate Prisma Client

After the database schema is pushed, generate the Prisma client:

```bash
npx prisma generate
```

## Troubleshooting

-   **Connection Errors:** Ensure you are using the **Direct Connection** (port 5432) and NOT the transaction pooler (port 6543) for migration commands like `db push`.
-   **Password:** Double-check your password. Special characters might need URL encoding, but usually, standard passwords work fine.
