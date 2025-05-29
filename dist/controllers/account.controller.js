"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async openAccount(req, res, next) {
        try {
            const { ownerName } = req.body;
            const account = await this.accountService.createAccount(ownerName);
            res.json({ accountId: account.id });
        }
        catch (e) {
            next(e);
        }
    }
    async deposit(req, res, next) {
        try {
            const { accountId, amount } = req.body;
            const transaction = await this.accountService.deposit({
                accountId,
                amount,
            });
            res.json({ transactionId: transaction.id });
        }
        catch (e) {
            next(e);
        }
    }
    async withdraw(req, res, next) {
        try {
            const { accountId, amount } = req.body;
            const transaction = await this.accountService.withdraw({
                accountId,
                amount,
            });
            res.json({ transactionId: transaction.id });
        }
        catch (e) {
            next(e);
        }
    }
    async getBalance(req, res, next) {
        try {
            const accountId = Number(req.params.id);
            const balance = await this.accountService.getBalance(accountId);
            res.json({ balance });
        }
        catch (e) {
            next(e);
        }
    }
}
exports.AccountController = AccountController;
