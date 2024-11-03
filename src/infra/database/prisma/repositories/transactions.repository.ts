import { Transaction } from '../../../../domain/entities/transactions';
import { TransactionTypeEnum } from '../../../../domain/enum/transaction-type.enum';
import { ITransactionsRepository } from '../../../../domain/repositories/transactions.repository';
import { InsuficientFundsError } from '../errors/insuficient-funds-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { prisma } from '../index';

export class TransactionsRepository implements ITransactionsRepository {
  async deposit(number: number, amount: number): Promise<Transaction> {
    const transaction = await prisma.$transaction(async (client) => {
      const account = await client.account.findUnique({
        where: { number },
      });

      if (!account) {
        throw new ResourceNotFoundError();
      }

      await client.account.update({
        where: { number },
        data: { balance: { increment: amount } },
      });

      return await client.transaction.create({
        data: {
          type: TransactionTypeEnum.DEPOSIT,
          from: null,
          to: account.number,
          amount,
          created_at: new Date(),
        },
      });
    });

    return new Transaction({
      id: transaction.id,
      type: transaction.type as TransactionTypeEnum,
      from: null,
      to: transaction.to,
      amount: transaction.amount,
    });
  }

  async withdrawal(number: number, amount: number): Promise<Transaction> {
    const transaction = await prisma.$transaction(async (client) => {
      const account = await client.account.findUnique({
        where: { number },
      });

      if (!account) {
        throw new ResourceNotFoundError();
      }

      if (account.balance < amount) {
        throw new InsuficientFundsError();
      }

      await client.account.update({
        where: { number },
        data: { balance: { decrement: amount } },
      });

      return await client.transaction.create({
        data: {
          type: TransactionTypeEnum.WITHDRAWAL,
          from: account.number,
          to: null,
          amount,
          created_at: new Date(),
        },
      });
    });

    return new Transaction({
      id: transaction.id,
      type: transaction.type as TransactionTypeEnum,
      from: null,
      to: transaction.to,
      amount: transaction.amount,
    });
  }

  async transfer(
    fromAccount: number,
    toAccount: number,
    amount: number,
  ): Promise<Transaction> {
    const transaction = await prisma.$transaction(async (client) => {
      const from = await client.account.findUnique({
        where: { number: fromAccount },
      });

      if (!from) {
        throw new ResourceNotFoundError();
      }

      if (from.balance < amount) {
        throw new InsuficientFundsError();
      }

      const to = await client.account.findUnique({
        where: { number: toAccount },
      });

      if (!to) {
        throw new ResourceNotFoundError();
      }

      await client.account.update({
        where: { number: fromAccount },
        data: { balance: { decrement: amount } },
      });

      await client.account.update({
        where: { number: toAccount },
        data: { balance: { increment: amount } },
      });

      return await client.transaction.create({
        data: {
          type: TransactionTypeEnum.TRANSFER,
          from: fromAccount,
          to: toAccount,
          amount,
          created_at: new Date(),
        },
      });
    });

    return new Transaction({
      id: transaction.id,
      type: transaction.type as TransactionTypeEnum,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
    });
  }
}
