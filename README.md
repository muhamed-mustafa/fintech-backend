# 💸 Fintech Backend API

A full-featured backend system for managing accounts and transactions using Node.js, TypeScript, Sequelize, and PostgreSQL.

## 🚀 Features

- Open new bank accounts
- Deposit and withdraw funds
- Check account balances
- Input validation using express-validator
- UUID-based account IDs
- Unit tests using Jest
- Dockerized PostgreSQL + App environment
- Swagger and Postman API documentation

---

## 📦 Setup Instructions

### 1. To get started, clone the repository

```bash
git clone https://github.com/muhamed-mustafa/fintech-backend.git
cd fintech-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 2. Setup environment

Create a `.env` file in the root:

```env
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_USER=YOUR_DB_USER
DB_PASS=YOUR_DB_PASS
DB_NAME=fintech
POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD
```

### 3. Run with Docker

```bash
docker-compose up --build
```

---

## 📬 Public API Documentation

- ✅ **Postman Documentation (Public):**  
  [View on Postman](https://documenter.getpostman.com/view/19649073/2sB2qf9K8t)

- ✅ **Swagger UI (Localhost):**  
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs#/default/get_api_accounts_balance)

---

## 🧪 Run Tests

```bash
pnpm test or npx jest
```

---

## 🛠 Tech Stack

- Node.js + TypeScript
- Express + Sequelize (PostgreSQL)
- Jest + ts-jest
- Docker + Docker Compose
- Swagger + Postman
