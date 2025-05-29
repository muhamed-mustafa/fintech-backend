import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { AccountService } from "../services/account.service";
import {
  OpenAccountValidator,
  DepositValidator,
  WithdrawValidator,
  BalanceCheckValidator,
} from "../validators/AccountValidator";

class AccountRoutes {
  public router: Router;
  private controller: AccountController;

  constructor() {
    this.router = Router();
    const service = new AccountService();
    this.controller = new AccountController(service);
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @openapi
     * /api/accounts:
     *   post:
     *     summary: Open a new account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ownerName:
     *                 type: string
     *             required:
     *               - ownerName
     *     responses:
     *       200:
     *         description: Account created successfully
     */
    this.router.post(
      "/accounts",
      new OpenAccountValidator().validate,
      this.controller.openAccount.bind(this.controller)
    );

    /**
     * @openapi
     * /api/accounts/deposit:
     *   patch:
     *     summary: Deposit money into an account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               accountId:
     *                 type: string
     *               amount:
     *                 type: number
     *             required:
     *               - accountId
     *               - amount
     *     responses:
     *       200:
     *         description: Deposit successful
     */
    this.router.patch(
      "/accounts/deposit",
      new DepositValidator().validate,
      this.controller.deposit.bind(this.controller)
    );

    /**
     * @openapi
     * /api/accounts/withdraw:
     *   patch:
     *     summary: Withdraw money from an account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               accountId:
     *                 type: string
     *               amount:
     *                 type: number
     *             required:
     *               - accountId
     *               - amount
     *     responses:
     *       200:
     *         description: Withdrawal successful
     */
    this.router.patch(
      "/accounts/withdraw",
      new WithdrawValidator().validate,
      this.controller.withdraw.bind(this.controller)
    );

    /**
     * @openapi
     * /api/accounts/balance:
     *   get:
     *     summary: Get account balance
     *     parameters:
     *       - name: id
     *         in: query
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Account balance retrieved
     */
    this.router.get(
      "/accounts/balance",
      new BalanceCheckValidator().validate,
      this.controller.getBalance.bind(this.controller)
    );
  }
}

export default new AccountRoutes().router;
