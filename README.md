# Integrated Real Estate Finance Platform (MVP)

A platform to simplify property purchase with bank financing — connecting **buyers**, **sellers**, **banks**, and **valuation companies** in one unified workflow.

## MVP Features

- Buyer request submission and case tracking
- Mock bank credit check with automatic loan limit calculation
- Property valuation module
- Buyer–seller linking
- Admin dashboard with stats and timeline
- Separate portal for each role (buyer, seller, bank, appraiser, admin)
- In-app notifications
- English UI (LTR)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS + Prisma + PostgreSQL |
| Frontend | Next.js 14 + Tailwind CSS |
| Auth | JWT + RBAC |
| Database | SQLite (dev) / PostgreSQL (prod) |

## Quick Start

### Prerequisites

- Node.js 18+
- npm

> PostgreSQL is optional — dev mode uses SQLite. For production, run `docker compose up -d`.

### Setup

```bash
# 1. Clone and install
npm run setup

# 2. Copy env
cp .env.example .env

# 3. Migration and seed
cd backend
npx prisma migrate dev
npm run prisma:seed
cd ..

# 4. Run
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api (proxied to the API server)

## Production Start

For a single-host deployment, build and start from the repository root:

```bash
npm run build
npm start
```

The production start command:

- runs Prisma migrations
- seeds the demo database
- starts the NestJS API on `API_PORT` (default: `3001`)
- starts Next.js on `PORT` (default: `3000`)
- proxies `/api/*` from Next.js to the API server

## Demo Accounts

Password for all: `123456`

| Role | Email |
|------|-------|
| Admin | admin@platform.com |
| Buyer | buyer@demo.com |
| Seller | seller@demo.com |
| Bank | bank@demo.com |
| Appraiser | appraiser@demo.com |

## Demo Scenario

A sample case (`RE-2026-DEMO01`) is pre-seeded in **Bank review** status:

1. **Bank** (`bank@demo.com`) → approve or reject credit check
2. **Admin** (`admin@platform.com`) → request valuation
3. **Appraiser** (`appraiser@demo.com`) → accept and submit valuation report
4. **Admin** → complete deal
5. **Buyer/Seller** → view final status

## Workflow

```
Application → Bank credit check → Property valuation → Ready for deal → Completed
```

## Project Structure

```
├── backend/          # NestJS API
│   ├── prisma/       # Schema + Seed
│   └── src/
│       ├── auth/     # JWT Authentication
│       ├── cases/    # Case workflow
│       ├── bank/     # Mock bank adapter
│       ├── appraisal/
│       ├── notifications/
│       └── dashboard/
├── frontend/         # Next.js App
│   ├── app/
│   │   ├── admin/    # Admin panel
│   │   ├── buyer/    # Buyer portal
│   │   ├── seller/   # Seller portal
│   │   ├── bank/     # Bank portal
│   │   └── appraiser/
│   └── components/
└── docker-compose.yml
```

## API Endpoints (Summary)

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/cases | List cases |
| POST | /api/cases | Create case |
| POST | /api/cases/:id/submit | Submit request |
| POST | /api/cases/:id/send-to-bank | Send to bank |
| POST | /api/bank/cases/:id/review | Credit review |
| POST | /api/appraisal/cases/:id/submit | Submit valuation report |
| GET | /api/dashboard/stats | Admin stats |

## Revenue Model (Future)

- Property valuation fees
- Bank partnership share
- Seller commission
- Buyer service fees

---

MVP version — ready for investor demos
