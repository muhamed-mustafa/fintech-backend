import { Request, Response, NextFunction } from "express";
import { AccountService } from "../services/account.service";

export class AccountController {
  constructor(private accountService: AccountService) {}

  async openAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerName, phoneNumber } = req.body;
      const account = await this.accountService.createAccount({
        ownerName,
        phoneNumber,
      });
      res.json({ accountId: account.id });
    } catch (e) {
      next(e);
    }
  }

  async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, amount } = req.body;
      const transaction = await this.accountService.deposit({
        accountId,
        amount,
      });
      res.json({ transactionId: transaction.id });
    } catch (e) {
      next(e);
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, amount } = req.body;
      const transaction = await this.accountService.withdraw({
        accountId,
        amount,
      });
      res.json({ transactionId: transaction.id });
    } catch (e) {
      next(e);
    }
  }

  async getBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const accountId = String(req.query.id);
      const balance = await this.accountService.getBalance(accountId);
      res.json({ balance });
    } catch (e) {
      next(e);
    }
  }
}
