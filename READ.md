# Inventory and Sales Management - Project Analysis

## Overview
This repository contains a full-stack Inventory and Sales Management system:

- Backend: Node.js + Express + Prisma + PostgreSQL
- Frontend: React (Vite) + Mantine UI + React Query + Axios
- Auth: JWT bearer tokens with role-based access (`ADMIN`, `STAFF`)

The app supports core business flows for products, inventory, suppliers, customers, purchase orders, sales orders, users, reports, and audit logs.

## Repository Structure

- `backend/`: REST API, business logic, database schema/migrations, seed scripts.
- `frontend/inventory-sales-management/`: Single-page app for operations and admin workflows.

## Tech Stack

### Backend
- Express `5.x`
- Prisma ORM `6.x`
- PostgreSQL datasource
- Zod validation
- JWT (`jsonwebtoken`) + bcrypt

### Frontend
- React `19`
- Vite `7`
- Mantine `8`
- TanStack React Query `5`
- React Router `7`
- Axios

## Core Domain Model (Prisma)
Main models:

- `User` (role, active/inactive)
- `Category`
- `Product` (pricing, reorder level, status)
- `Supplier`
- `Customer`
- `PurchaseOrder` + `PurchaseOrderItem`
- `SalesOrder` + `SalesOrderItem`
- `StockMovement`
- `AuditLog`

Business status enums are implemented for purchase and sales order lifecycles.

## API Surface (high-level)
All routes are mounted under `/api`.

- `POST /api/auth/login`
- `GET/POST/PATCH /api/users` (admin-only for create/list/status toggle)
- CRUD and status routes for categories, products, suppliers, customers
- Purchase order lifecycle routes (`ordered`, `receive`, `cancel`)
- Sales order lifecycle routes (`confirm`, `complete`, `cancel`)
- Inventory stock and movement endpoints
- `GET /api/reports/dashboard`
- `GET /api/audit-logs` (admin-only)

## Frontend Coverage
The UI includes pages for:

- Login
- Dashboard
- Users
- Customers
- Suppliers
- Categories
- Products
- Inventory
- Purchase Orders (list/create/edit)
- Sales Orders (list/create/edit)
- Audit Logs

Routing is protected via `ProtectedRoute`, and bearer tokens are attached through a centralized Axios instance.

## Authentication and Authorization

- Login returns `{ token, user }`.
- Token is persisted in local storage and sent as `Authorization: Bearer <token>`.
- Backend middleware validates JWT and injects `req.user`.
- Role checks are enforced via `requireRole(...)` in sensitive routes.

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL=postgresql://...`
- `JWT_SECRET=your-secret`
- `JWT_EXPIRES_IN=1d`
- `PORT=4000` (optional)

### Frontend (`frontend/inventory-sales-management/.env`)
- `VITE_API_URL=http://localhost:4000/api`

## Local Setup

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend/inventory-sales-management && npm install
```

### 2) Configure environment files
Create `.env` files in backend and frontend using the variables above.

### 3) Initialize database

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

Seed creates default admin:
- Email: `admin@gmail.com`
- Password: `admin123`

### 4) Run the apps

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend/inventory-sales-management
npm run dev
```

## Current Observations

- Frontend template README is still default Vite text; project-level documentation was missing before this file.
- `GET /api/reports/dashboard` route is currently exposed without `requireAuth` middleware.
- There are a few debug `console.log` statements in auth-related files that may be removed for production hygiene.

## Suggested Next Improvements

1. Add a root `README.md` that links backend/frontend runbooks and deployment notes.
2. Protect report endpoints with auth and role checks if business data is sensitive.
3. Add automated tests for order lifecycle transitions and stock consistency.
4. Add `.env.example` files for backend and frontend.
5. Introduce API docs (OpenAPI/Swagger) for faster onboarding.
