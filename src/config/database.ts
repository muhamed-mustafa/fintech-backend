import { Sequelize } from "sequelize-typescript";
import { Account } from "../models/account.model";
import { Transaction } from "../models/transaction.model";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "postgres",
  database: process.env.DB_NAME || "fintech",
  models: [Account, Transaction],
  logging: false,
});
