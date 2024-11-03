import { Transaction } from '../entities/transactions';

export interface ITransactionsRepository {
  deposit(accountNumber: number, amount: number): Promise<Transaction>;
  withdrawal(accountNumber: number, amount: number): Promise<Transaction>;
  transfer(
    fromAccount: number,
    toAccount: number,
    amount: number,
  ): Promise<Transaction>;
}
