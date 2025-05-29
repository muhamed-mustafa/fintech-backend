export interface CreateAccountDto {
  ownerName: string;
  phoneNumber: string;
}

export interface TransactionDto {
  accountId: string;
  amount: number;
}
