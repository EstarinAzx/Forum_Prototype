# Forum Prototype - Full Stack Documentation

> **Complete technical documentation for the frontend and backend setup of the Forum Prototype application.**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Backend Setup](#backend-setup)
   - [Dependencies](#backend-dependencies)
   - [Environment Variables](#environment-variables)
   - [Database Schema (Prisma)](#database-schema-prisma)
   - [Server Entry Point](#server-entry-point)
   - [API Routes](#api-routes)
   - [Authentication Middleware](#authentication-middleware)
   - [Utility Libraries](#utility-libraries)
5. [Frontend Setup](#frontend-setup)
   - [Dependencies](#frontend-dependencies)
   - [Vite Configuration](#vite-configuration)
   - [Tailwind CSS Configuration](#tailwind-css-configuration)
   - [Application Entry](#application-entry)
   - [Routing](#routing)
   - [Authentication Context](#authentication-context)
   - [API Utilities](#api-utilities)
   - [Components](#components)
   - [Pages](#pages)
6. [Authentication Flow](#authentication-flow)
7. [API Reference](#api-reference)
8. [Running the Application](#running-the-application)

---

## Project Overview

The **Forum Prototype** is a full-stack web application built with a React frontend and an Express.js backend. It implements a Reddit-style forum with features including:

- **User Authentication** (signup, login, logout with JWT tokens)
- **Communities** (create and browse forum communities)
- **Posts** (create posts within communities, view feed)
- **Comments** (nested comment system with replies)
- **Upvotes** (toggle upvotes on posts)
- **User Profiles** (view profile information)

---

## Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js v5** | Web framework |
| **TypeScript** | Type-safe development |
| **Prisma** | ORM for database operations |
| **PostgreSQL** | Database (Supabase) |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **tsx** | TypeScript execution for development |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type-safe development |
| **Vite** | Build tool and dev server |
| **React Router DOM v6** | Client-side routing |
| **TailwindCSS v3** | Utility-first CSS framework |
| **Lucide React** | Icon library |
| **clsx + tailwind-merge** | Conditional class utilities |

---

## Project Structure

```
forum_prototype/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database models
│   ├── src/
│   │   ├── index.ts             # Express server entry point
│   │   ├── lib/
│   │   │   ├── db.ts            # Prisma client instance
│   │   │   ├── jwt.ts           # JWT token utilities
│   │   │   └── password.ts      # Password hashing utilities
│   │   ├── middleware/
│   │   │   └── auth.ts          # Authentication middleware
│   │   └── routes/
│   │       ├── auth.ts          # Authentication routes
│   │       ├── users.ts         # User routes
│   │       ├── communities.ts   # Community routes
│   │       ├── posts.ts         # Post routes
│   │       └── comments.ts      # Comment routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx             # React entry point
│   │   ├── App.tsx              # Main app with routing
│   │   ├── index.css            # Global styles
│   │   ├── components/
│   │   │   ├── Layout.tsx       # Main layout with navbar
│   │   │   ├── Button.tsx       # Reusable button component
│   │   │   ├── Input.tsx        # Reusable input component
│   │   │   ├── PostCard.tsx     # Post display card
│   │   │   └── CommentSection.tsx # Comment display/create
│   │   ├── context/
│   │   │   └── AuthContext.tsx  # Authentication state
│   │   ├── lib/
│   │   │   ├── api.ts           # API fetch utilities
│   │   │   └── utils.ts         # General utilities
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Signup.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Community.tsx
│   │       ├── PostDetail.tsx
│   │       ├── Profile.tsx
│   │       ├── CreateCommunity.tsx
│   │       └── CreatePost.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
└── guides/                      # Documentation
```

---

## Backend Setup

### Backend Dependencies

```json
{
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.8.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.0.0",
    "@types/node": "^24.10.1",
    "prisma": "^5.10.0",
    "tsx": "^4.21.0",
    "typescript": "^5.9.3"
  }
}
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Compile TypeScript to JavaScript |
| `start` | `npm run start` | Run compiled production server |
| `prisma:generate` | `npm run prisma:generate` | Generate Prisma Client |
| `prisma:studio` | `npm run prisma:studio` | Open Prisma Studio GUI |

---

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Connection (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/database"

# JWT Configuration
JWT_SECRET="your-secret-key-change-in-production"

# Server Configuration
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

> **Note:** `DATABASE_URL` uses connection pooling (pgbouncer), while `DIRECT_URL` is used for Prisma migrations.

---

### Database Schema (Prisma)

The database schema is defined in `backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

#### Models

```mermaid
erDiagram
    User ||--o{ Post : creates
    User ||--o{ Comment : writes
    User ||--o{ PostUpvote : gives
    User ||--o{ Community : creates
    User ||--o{ RefreshToken : has
    
    Community ||--o{ Post : contains
    
    Post ||--o{ Comment : has
    Post ||--o{ PostUpvote : receives
    
    Comment ||--o{ Comment : replies

    User {
        string id PK
        string email UK
        string username UK
        string name
        string password
        string role
        string profilePicture
        datetime createdAt
        datetime updatedAt
    }
    
    RefreshToken {
        string id PK
        string token UK
        string userId FK
        datetime expiresAt
        datetime createdAt
    }
    
    Community {
        string id PK
        string name UK
        string description
        string creatorId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Post {
        string id PK
        string title
        string content
        string authorId FK
        string communityId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Comment {
        string id PK
        string content
        string authorId FK
        string postId FK
        string parentId FK
        datetime createdAt
        datetime updatedAt
    }
    
    PostUpvote {
        string id PK
        string userId FK
        string postId FK
        datetime createdAt
    }
```

> **Key Features:**
> - Uses CUID for all primary keys
> - Cascade deletes configured for maintaining referential integrity
> - Nested comments support via self-referential `Comment` model
> - Unique constraint on `userId + postId` for upvotes (one vote per user per post)

---

### Server Entry Point

**File:** `backend/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import communityRoutes from './routes/communities';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
}));

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

### API Routes

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/signup` | No | Register a new user |
| POST | `/login` | No | Authenticate and get tokens |
| POST | `/refresh-token` | No | Refresh access token |
| POST | `/logout` | No | Invalidate refresh token |

#### User Routes (`/api/users`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/me` | Yes | Get current user's profile |

#### Community Routes (`/api/communities`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | List all communities |
| POST | `/` | Yes | Create a new community |
| GET | `/:name` | No | Get a specific community by name |

#### Post Routes (`/api/posts`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | List posts (optional `?communityId=` filter) |
| POST | `/` | Yes | Create a new post |
| GET | `/:id` | No | Get a specific post |
| POST | `/:id/upvote` | Yes | Toggle upvote on a post |

#### Comment Routes (`/api/comments`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/post/:postId` | No | Get comments for a post |
| POST | `/` | Yes | Create a new comment |

---

### Authentication Middleware

**File:** `backend/src/middleware/auth.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import prisma from '../lib/db';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
}

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true },
    });

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    req.userId = user.id;
    req.userRole = user.role;
    next();
}
```

---

### Utility Libraries

#### Database Client (`lib/db.ts`)
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;
```

#### JWT Utilities (`lib/jwt.ts`)
- `generateAccessToken(userId)` - Creates access token (1h expiry)
- `generateRefreshToken(userId)` - Creates refresh token (7d expiry)
- `generateTokenPair(userId)` - Returns both tokens
- `verifyToken(token)` - Validates and decodes token
- `getRefreshTokenExpiry()` - Returns Date 7 days from now

#### Password Utilities (`lib/password.ts`)
- `hashPassword(password)` - Hash using bcrypt
- `verifyPassword(password, hash)` - Compare password with hash

---

## Frontend Setup

### Frontend Dependencies

```json
{
  "dependencies": {
    "clsx": "^2.1.0",
    "lucide-react": "^0.350.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6"
  }
}
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite dev server (port 5173) |
| `build` | `npm run build` | Build for production |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint |

---

### Vite Configuration

**File:** `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
});
```

---

### Tailwind CSS Configuration

**File:** `frontend/tailwind.config.js`

```javascript
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6',      // Blue
                    foreground: '#ffffff',
                },
                background: '#ffffff',
                foreground: '#0a0a0a',
                card: '#f9fafb',
                'card-foreground': '#0a0a0a',
                muted: '#f3f4f6',
                'muted-foreground': '#6b7280',
                accent: '#f3f4f6',
                'accent-foreground': '#0a0a0a',
                destructive: '#ef4444',      // Red
                'destructive-foreground': '#ffffff',
                border: '#e5e7eb',
            },
        },
    },
    plugins: [],
};
```

---

### Application Entry

**File:** `frontend/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

---

### Routing

**File:** `frontend/src/App.tsx`

```mermaid
graph TD
    A[BrowserRouter] --> B[AuthProvider]
    B --> C[Routes]
    C --> D[Layout]
    
    D --> E["/"]
    E --> E1[Dashboard]
    
    D --> F["/r/:name"]
    F --> F1[Community]
    
    D --> G["/post/:id"]
    G --> G1[PostDetail]
    
    D --> H["/login"]
    H --> H1[Login]
    
    D --> I["/signup"]
    I --> I1[Signup]
    
    D --> J["/profile"]
    J --> J1[ProtectedRoute]
    J1 --> J2[Profile]
    
    D --> K["/create-community"]
    K --> K1[ProtectedRoute]
    K1 --> K2[CreateCommunity]
    
    D --> L["/create-post"]
    L --> L1[ProtectedRoute]
    L1 --> L2[CreatePost]
    
    D --> M["/r/:name/submit"]
    M --> M1[ProtectedRoute]
    M1 --> M2[CreatePost]
```

#### Route Protection

The `ProtectedRoute` component wraps routes that require authentication:

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

---

### Authentication Context

**File:** `frontend/src/context/AuthContext.tsx`

Provides global authentication state and functions:

```typescript
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string, username?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}
```

**Key Features:**
- Stores tokens in `localStorage` (`accessToken`, `refreshToken`)
- Auto-checks authentication on app load
- Provides `useAuth()` hook for consuming components

---

### API Utilities

**File:** `frontend/src/lib/api.ts`

```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // Automatically adds Authorization header
    // Handles 401 responses by attempting token refresh
    // Redirects to /login if refresh fails
}
```

**Usage:**
```typescript
const response = await fetchWithAuth('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content, communityId }),
});
```

---

### Components

| Component | File | Description |
|-----------|------|-------------|
| **Layout** | `Layout.tsx` | Main app shell with navbar, handles responsive menu |
| **Button** | `Button.tsx` | Reusable button with variants (default, destructive, outline, ghost) |
| **Input** | `Input.tsx` | Styled input component |
| **PostCard** | `PostCard.tsx` | Displays post preview with upvote count, comments, author |
| **CommentSection** | `CommentSection.tsx` | Displays and creates comments with nested replies |

---

### Pages

| Page | Route | Description |
|------|-------|-------------|
| **Dashboard** | `/` | Home feed showing all posts |
| **Login** | `/login` | User login form |
| **Signup** | `/signup` | User registration form |
| **Community** | `/r/:name` | View community and its posts |
| **PostDetail** | `/post/:id` | Full post view with comments |
| **Profile** | `/profile` | Current user's profile (protected) |
| **CreateCommunity** | `/create-community` | Create new community form (protected) |
| **CreatePost** | `/create-post`, `/r/:name/submit` | Create new post form (protected) |

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    Note over User,Database: Registration Flow
    User->>Frontend: Fill signup form
    Frontend->>Backend: POST /api/auth/signup
    Backend->>Backend: Hash password (bcrypt)
    Backend->>Database: Create User record
    Backend->>Database: Create RefreshToken record
    Backend->>Frontend: Return user + accessToken + refreshToken
    Frontend->>Frontend: Store tokens in localStorage
    Frontend->>User: Redirect to dashboard

    Note over User,Database: Login Flow
    User->>Frontend: Fill login form
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Find user by email
    Backend->>Backend: Verify password
    Backend->>Database: Create RefreshToken record
    Backend->>Frontend: Return user + accessToken + refreshToken
    Frontend->>Frontend: Store tokens in localStorage

    Note over User,Database: Protected Request Flow
    User->>Frontend: Access protected resource
    Frontend->>Backend: Request with Authorization: Bearer {accessToken}
    Backend->>Backend: Verify JWT
    Backend->>Database: Validate user exists
    Backend->>Frontend: Return protected data

    Note over User,Database: Token Refresh Flow
    Frontend->>Backend: Request fails with 401
    Frontend->>Backend: POST /api/auth/refresh-token
    Backend->>Database: Find RefreshToken
    Backend->>Backend: Generate new accessToken
    Backend->>Frontend: Return new accessToken
    Frontend->>Frontend: Update localStorage
    Frontend->>Backend: Retry original request

    Note over User,Database: Logout Flow
    User->>Frontend: Click logout
    Frontend->>Backend: POST /api/auth/logout
    Backend->>Database: Delete RefreshToken
    Frontend->>Frontend: Clear localStorage
    Frontend->>User: Redirect to login
```

---

## API Reference

### Authentication

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe",
    "username": "johndoe"
}
```

**Response (201):**
```json
{
    "user": {
        "id": "clxx...",
        "email": "user@example.com",
        "name": "John Doe",
        "username": "johndoe",
        "role": "USER"
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
}
```

---

#### POST `/api/auth/login`
Authenticate an existing user.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "securepassword"
}
```

**Response (200):**
```json
{
    "user": {
        "id": "clxx...",
        "email": "user@example.com",
        "name": "John Doe",
        "username": "johndoe",
        "role": "USER",
        "profilePicture": null
    },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
}
```

---

#### POST `/api/auth/refresh-token`
Get a new access token using a refresh token.

**Request Body:**
```json
{
    "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
    "accessToken": "eyJhbGci..."
}
```

---

### Posts

#### GET `/api/posts`
List all posts or filter by community.

**Query Parameters:**
- `communityId` (optional) - Filter posts by community ID

**Response (200):**
```json
[
    {
        "id": "clxx...",
        "title": "My First Post",
        "content": "Hello world!",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "author": {
            "id": "clxx...",
            "username": "johndoe",
            "name": "John Doe"
        },
        "community": {
            "id": "clxx...",
            "name": "general"
        },
        "_count": {
            "comments": 5,
            "upvotes": 10
        }
    }
]
```

---

#### POST `/api/posts`
Create a new post (requires authentication).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
    "title": "My First Post",
    "content": "Hello world!",
    "communityId": "clxx..."
}
```

---

### Communities

#### GET `/api/communities`
List all communities.

**Response (200):**
```json
[
    {
        "id": "clxx...",
        "name": "general",
        "description": "General discussion",
        "_count": {
            "posts": 42
        }
    }
]
```

---

## Running the Application

### Prerequisites

- Node.js v18+
- npm or pnpm
- PostgreSQL database (Supabase recommended)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

**Backend (`.env`):**
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Frontend (`.env` - optional):**
```env
VITE_API_URL="http://localhost:3000"
```

---

## Development Workflow

1. **Backend** runs on `http://localhost:3000`
2. **Frontend** runs on `http://localhost:5173`
3. CORS is configured to allow frontend origin
4. Use `npm run prisma:studio` to browse database visually

---

## Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + TypeScript + Vite | User interface |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Routing** | React Router DOM | Client-side navigation |
| **State** | React Context | Authentication state |
| **Backend** | Express + TypeScript | REST API server |
| **ORM** | Prisma | Database abstraction |
| **Database** | PostgreSQL (Supabase) | Data persistence |
| **Auth** | JWT | Stateless authentication |

---

*Documentation generated on December 15, 2024*
