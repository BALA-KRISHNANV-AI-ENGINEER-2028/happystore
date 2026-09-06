# Happy Store — Backend Developer Guide

## Overview
Enterprise-grade NestJS backend for the Happy Store platform. Provides a REST API consumed by the existing React frontend, with PostgreSQL + PostGIS, Redis, Prisma ORM, JWT authentication, and Docker orchestration.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 10 (TypeScript) |
| Database | PostgreSQL 15 + PostGIS 3.3 |
| ORM | Prisma 5.22 |
| Cache | Redis 7 |
| Auth | JWT (Access + Refresh Tokens) + RBAC |
| Docs | Swagger / OpenAPI 3.0 |
| Containerization | Docker + Docker Compose |

---

## Getting Started

### 1. Prerequisites
- Docker and Docker Compose installed
- Node.js 18+

### 2. Start Infrastructure (Database + Redis)

```bash
# From the workspace root (happy_store/)
docker compose up db redis -d
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

```bash
# Copy the example file and update as needed
cp .env.example .env
```

Key variables to set for production:
- `JWT_ACCESS_SECRET` — Min 32 chars, change from default
- `JWT_REFRESH_SECRET` — Min 32 chars, change from default
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — For OAuth
- `CORS_ORIGIN` — Your frontend URL

### 5. Run Database Migrations & Seed

```bash
# Create database schema
npm run db:migrate

# Seed with sample data (shops, products, users)
npm run db:seed
```

### 6. Start the Dev Server

```bash
npm run start:dev
```

The API will be available at:
- **API Base**: `http://localhost:4000/api`
- **Swagger Docs**: `http://localhost:4000/api/docs`
- **Health Check**: `http://localhost:4000/api/health`

---

## Full Docker Stack (All Services)

```bash
# Start all services: DB + Redis + Backend
docker compose up --build

# Or run in background
docker compose up --build -d
```

---

## Architecture

```
backend/src/
├── main.ts                     # Bootstrap: Helmet, CORS, Swagger, Validation
├── app.module.ts               # Root module — global guards, filters, interceptors
├── common/
│   ├── config/                 # Zod environment validation
│   ├── database/               # PrismaService + PrismaModule (global)
│   ├── redis/                  # RedisModule (global)
│   ├── decorators/             # @CurrentUser, @Roles, @Public
│   ├── filters/                # GlobalExceptionFilter (HTTP + Prisma errors)
│   ├── guards/                 # JwtAuthGuard, RolesGuard
│   ├── interceptors/           # ResponseInterceptor (unified response envelope)
│   └── utils/                  # paginate(), buildPaginatedResult(), haversineDistanceKm()
└── modules/
    ├── health/                 # GET /api/health
    ├── auth/                   # POST /api/auth/register|login|refresh|logout
    ├── users/                  # GET|PATCH|DELETE /api/users (Admin only)
    ├── shops/                  # CRUD /api/shops (public reads, auth writes)
    ├── products/               # CRUD /api/products (public reads, auth writes)
    └── orders/                 # CRUD /api/orders (authenticated)
```

## API Response Format

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-07-16T13:00:00.000Z"
}
```

Paginated endpoints additionally include:

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-07-16T13:00:00.000Z"
}
```

## Seeded Users

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@happystore.com` | `Password123!` |
| Shop Owner | `owner.rivera@happystore.com` | `Password123!` |
| Shop Owner | `owner.chen@happystore.com` | `Password123!` |
| Customer | `alex.morgan@email.com` | `Password123!` |

## Useful Commands

```bash
npm run db:studio      # Open Prisma Studio GUI
npm run db:reset       # Reset database (caution: deletes all data)
npm run db:seed        # Reseed the database
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint
npm run format         # Run Prettier
```
