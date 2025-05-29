import { loadEnvFile } from "./utils/loadEnv";

const envPath = process.env.NODE_ENV === "production" ? "./.env" : "./.env.dev";

loadEnvFile(envPath);

import express, { Application } from "express";
import accountRoutes from "./routes/account.routes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./config/database";
import fs from "fs";
import path from "path";
import swagger from './swagger';

export class App {
  public app: Application;
  private readonly port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use("/api", accountRoutes);
  }

  private initializeSwagger(): void {
    const swaggerPath = path.join(__dirname, "..", "swagger", "swagger.json");

    if (fs.existsSync(swaggerPath)) {
      // const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
      this.app.use(
        "/api-docs",
        ...swagger,
        // swaggerUi.serve,
        // swaggerUi.setup(swaggerDocument)
      );
    } else {
      console.warn("⚠️ Swagger file not found:", swaggerPath);
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      await sequelize.sync({ alter: true });
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
    }
  }
}
