"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class App {
    constructor(port = 3000) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
    }
    initializeRoutes() {
        this.app.use("/api", account_routes_1.default);
    }
    initializeSwagger() {
        const swaggerPath = path_1.default.join(__dirname, "..", "swagger", "swagger.json");
        if (fs_1.default.existsSync(swaggerPath)) {
            const swaggerDocument = JSON.parse(fs_1.default.readFileSync(swaggerPath, "utf-8"));
            this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        }
        else {
            console.warn("⚠️ Swagger file not found:", swaggerPath);
        }
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    async start() {
        try {
            await database_1.sequelize.sync({ alter: true });
            this.app.listen(this.port, () => {
                console.log(`🚀 Server running on port ${this.port}`);
            });
        }
        catch (error) {
            console.error("❌ Failed to start server:", error);
        }
    }
}
exports.App = App;
