"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const account_model_1 = require("../models/account.model");
const transaction_model_1 = require("../models/transaction.model");
const customError_1 = require("../utils/customError");
class AccountService {
    async createAccount(ownerName) {
        return account_model_1.Account.create({ ownerName });
    }
    async deposit({ accountId, amount }) {
        const account = await account_model_1.Account.findByPk(accountId);
        if (!account)
            throw new customError_1.CustomError('Account not found', 404);
        account.balance += amount;
        await account.save();
        return transaction_model_1.Transaction.create({ accountId, amount, type: 'deposit' });
    }
    async withdraw({ accountId, amount }) {
        const account = await account_model_1.Account.findByPk(accountId);
        if (!account)
            throw new customError_1.CustomError('Account not found', 404);
        if (account.balance < amount)
            throw new customError_1.CustomError('Insufficient funds', 400);
        account.balance -= amount;
        await account.save();
        return transaction_model_1.Transaction.create({ accountId, amount, type: 'withdraw' });
    }
    async getBalance(accountId) {
        const account = await account_model_1.Account.findByPk(accountId);
        if (!account)
            throw new customError_1.CustomError('Account not found', 404);
        return account.balance;
    }
}
exports.AccountService = AccountService;
