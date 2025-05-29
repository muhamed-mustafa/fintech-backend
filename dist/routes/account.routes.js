"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_controller_1 = require("../controllers/account.controller");
const account_service_1 = require("../services/account.service");
class AccountRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        const accountService = new account_service_1.AccountService();
        this.controller = new account_controller_1.AccountController(accountService);
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/accounts", (req, res, next) => this.controller.openAccount(req, res, next));
        this.router.post("/accounts/deposit", (req, res, next) => this.controller.deposit(req, res, next));
        this.router.post("/accounts/withdraw", (req, res, next) => this.controller.withdraw(req, res, next));
        this.router.get("/accounts/:id/balance", (req, res, next) => this.controller.getBalance(req, res, next));
    }
}
exports.default = new AccountRoutes().router;
