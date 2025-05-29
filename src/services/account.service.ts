import { Account } from "../models/account.model";
import { Transaction } from "../models/transaction.model";
import { CreateAccountDto, TransactionDto } from "../dtos/account.dto";
import { CustomError } from "../utils/customError";

export class AccountService {
  async createAccount({
    ownerName,
    phoneNumber,
  }: CreateAccountDto): Promise<Account> {
    return Account.create({ ownerName, phoneNumber });
  }

  async getAccountById(accountId: string): Promise<Account> {
    const account = await Account.findByPk(accountId);
    if (!account) throw new CustomError("Account not found", 404);
    return account;
  }

  async deposit({ accountId, amount }: TransactionDto): Promise<Transaction> {
    const account = await this.getAccountById(accountId);

    const currentBalance = account.getBalance();

    const newBalance = currentBalance + amount;

    if(account.setBalance) {
      account.setBalance(+newBalance);
    }
    
    else {
      account.balance = newBalance.toFixed(2);    
    }

    await account.save();

    return Transaction.create({ accountId, amount, type: "deposit" });
  }

  async withdraw({ accountId, amount }: TransactionDto): Promise<Transaction> {
    const account = await this.getAccountById(accountId);

    const currentBalance = parseFloat(account.balance);

    if (currentBalance < amount)
      throw new CustomError("Insufficient funds", 400);

    const newBalance = currentBalance - amount;

    account.balance = newBalance.toFixed(2);

    await account.save();

    return Transaction.create({ accountId, amount, type: "withdraw" });
  }

  async getBalance(accountId: string): Promise<number> {
    const account = await this.getAccountById(accountId);
    return parseFloat(account.balance);
  }
}
