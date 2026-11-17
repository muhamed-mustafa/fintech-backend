# Fintech Backend API

A small REST API for opening bank accounts, depositing, withdrawing and checking balances, built with Express, TypeScript, Sequelize and PostgreSQL.

This is a compact, single-resource service. It demonstrates a layered Express codebase in TypeScript (routes, validators, controller, service, models), decorator-based Sequelize models, request validation with reusable validator classes, centralized error handling, OpenAPI documentation generated from route annotations, and a Dockerized app + database setup.

## Features

- Open an account with an owner name and a unique phone number; accounts are identified by UUID v4
- Deposit to and withdraw from an account, with an insufficient-funds check on withdrawal
- Every deposit and withdrawal is recorded as a row in a `transactions` table linked to the account
- Balance lookup by account id
- Request validation with `express-validator`, including a uniqueness check on the phone number
- Centralized error handler with a typed `CustomError` (status code + message)
- Swagger UI generated from `@openapi` JSDoc annotations on the routes
- Unit tests for the service layer with Jest
- Docker Compose setup for the API and PostgreSQL

## Architecture

```text
.
├── __tests__/
│   └── account.service.test.ts   # service unit tests (models mocked)
├── src/
│   ├── server.ts                 # entry point
│   ├── app.ts                    # App class: middleware, routes, Swagger, error handler, DB sync
│   ├── swagger.ts                # swagger-jsdoc + swagger-ui-express setup
│   ├── config/database.ts        # Sequelize instance
│   ├── routes/account.routes.ts  # route definitions + OpenAPI annotations
│   ├── validators/               # BaseValidator + one validator class per endpoint
│   ├── controllers/              # HTTP layer, delegates to the service
│   ├── services/                 # business logic
│   ├── models/                   # Account, Transaction (sequelize-typescript)
│   ├── dtos/                     # input types
│   ├── middlewares/errorHandler.ts
│   └── utils/                    # CustomError, .env file loader
├── swagger/swagger.json
├── Dockerfile
└── docker-compose.yml
```

A request passes through a validator chain, then the controller, then `AccountService`, which works directly with the Sequelize models. Each endpoint has its own validator class extending an abstract `BaseValidator`, which appends a shared handler that returns `400` with the validation errors. Errors thrown in the service as `CustomError` are translated to their status code by the error middleware; anything else becomes a `500`.

Data model: `accounts` (UUID id, `ownerName`, unique `phoneNumber`, `balance` as `DECIMAL(20,10)`) has many `transactions` (UUID id, `accountId`, `type` of `deposit` or `withdraw`, `amount` as `DECIMAL(10,2)`). The schema is created on startup with `sequelize.sync({ alter: true })`; there are no migration files.

Known limitation: a deposit or withdrawal updates the balance and then inserts the transaction row as two separate statements. They are not wrapped in a database transaction and the account row is not locked, so the operations are not atomic or safe under concurrent requests. See the roadmap.

Environment variables are loaded by a small built-in parser (`src/utils/loadEnv.ts`) rather than `dotenv`: `.env` when `NODE_ENV=production` (the `start` script), `.env.dev` otherwise (the `dev` script).

## Tech Stack

- Node.js 18, TypeScript
- Express 4
- Sequelize 6 with `sequelize-typescript`, PostgreSQL 13
- `express-validator`
- `swagger-jsdoc`, `swagger-ui-express`
- Jest, `ts-jest`
- Docker, Docker Compose
- pnpm

## Getting Started

### Prerequisites

- Docker and Docker Compose, or
- Node.js 18+, pnpm, and a PostgreSQL instance

### Run with Docker

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)) with `DB_HOST=db`, then:

```bash
git clone https://github.com/muhamed-mustafa/fintech-backend.git
cd fintech-backend
docker compose up --build
```

This starts PostgreSQL 13 on port `5432` and the API on port `3000`. The app container runs `pnpm start`.

### Run locally

Create a `.env.dev` file with `DB_HOST=localhost` pointing at a running PostgreSQL instance, then:

```bash
pnpm install
pnpm dev
```

| Script       | What it does                                                     |
| ------------ | ---------------------------------------------------------------- |
| `pnpm dev`   | Runs `src/server.ts` with `ts-node-dev`, reading `.env.dev`      |
| `pnpm start` | Runs `src/server.ts` with `ts-node-dev`, reading `.env`          |
| `pnpm build` | Compiles TypeScript to `dist/`                                   |
| `pnpm test`  | Runs the Jest suite                                              |

## Environment Variables

| Name                | Used by            | Meaning                                              |
| ------------------- | ------------------ | ---------------------------------------------------- |
| `PORT`              | API                | Port the API listens on (Compose maps `3000`)        |
| `DB_HOST`           | API                | PostgreSQL host (`db` in Compose, `localhost` locally) |
| `DB_PORT`           | API                | PostgreSQL port                                      |
| `DB_USER`           | API, Compose       | Database user                                        |
| `DB_PASS`           | API                | Database password used by the API                    |
| `DB_NAME`           | API, Compose       | Database name                                        |
| `POSTGRES_PASSWORD` | Compose            | Password the PostgreSQL container is initialized with; must match `DB_PASS` |

## API Overview

All routes are mounted under `/api`.

| Method  | Path                     | Purpose                                                                 |
| ------- | ------------------------ | ----------------------------------------------------------------------- |
| `POST`  | `/api/accounts`          | Open an account. Body: `ownerName`, `phoneNumber` (10-11 digits, unique). Returns `{ accountId }` |
| `PATCH` | `/api/accounts/deposit`  | Deposit. Body: `accountId` (UUID v4), `amount` (> 0). Returns `{ transactionId }` |
| `PATCH` | `/api/accounts/withdraw` | Withdraw. Same body as deposit. Returns `{ transactionId }`; `400` on insufficient funds |
| `GET`   | `/api/accounts/balance`  | Balance lookup. Query: `id` (UUID v4). Returns `{ balance }`            |

Error responses: `400` with `{ errors: [...] }` for validation failures, `{ message }` with `404` for an unknown account or `400` for insufficient funds.

Swagger UI is served at `http://localhost:3000/api-docs`.

## Testing

```bash
pnpm test
```

The suite contains seven unit tests for `AccountService` with the Sequelize models mocked: account creation, deposit, withdrawal, balance lookup, and the not-found and insufficient-funds error paths. There are no HTTP-level or database integration tests yet.

## Project Status / Roadmap

A small, working exercise rather than a production system. Open items:

- Wrap balance update and transaction insert in a single database transaction with row locking
- Use decimal arithmetic for money instead of JavaScript floats, and align rounding between deposit and withdraw
- Add account-to-account transfers and a transaction history endpoint
- Add authentication
- Replace `sync({ alter: true })` with migrations
- Add integration tests against a real database (`supertest` is installed but unused)
- Run compiled output in production instead of `ts-node-dev`
- Bring the OpenAPI annotations in line with the validators (`phoneNumber` is missing from the documented request body)
- Stop tracking `.env`, `.env.dev` and `dist/`; add a `.env.example`

---

Built by [muhamed-mustafa](https://github.com/muhamed-mustafa).
