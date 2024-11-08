import { Prisma } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import { Account } from '../../../../domain/entities/account';
import { Transaction } from '../../../../domain/entities/transactions';
import { TransactionTypeEnum } from '../../../../domain/enum/transaction-type.enum';
import { ITransactionsRepository } from '../../../../domain/repositories/transactions.repository';
import { InsuficientFundsError } from '../errors/insuficient-funds-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { prisma } from '../index';

export class TransactionsRepository implements ITransactionsRepository {
  private readonly logger: FastifyLoggerInstance;

  constructor(logger: FastifyLoggerInstance) {
    this.logger = logger;
  }

  async deposit(number: number, amount: number): Promise<Transaction> {
    this.logger.info(`Initiating deposit: Account ${number}, Amount ${amount}`);

    const transaction = await prisma.$transaction(async (client) => {
      const account = await client.account.findUnique({
        where: { number },
      });

      if (!account) {
        this.logger.error(`Account not found for number ${number}`);
        throw new ResourceNotFoundError();
      }

      await client.account.update({
        where: { number },
        data: { balance: { increment: amount } },
      });

      this.logger.info(`Account ${number} balance incremented by ${amount}`);

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

    this.logger.info(
      `Deposit transaction completed with ID: ${transaction.id}`,
    );

    return new Transaction({
      id: transaction.id,
      type: transaction.type as TransactionTypeEnum,
      from: null,
      to: transaction.to,
      amount: transaction.amount,
    });
  }

  async withdrawal(number: number, amount: number): Promise<Transaction> {
    this.logger.info(
      `Starting withdrawal for account ${number} with amount ${amount}`,
    );

    const transaction = await prisma.$transaction(async (client) => {
      const account = await client.$queryRaw<Account>(
        Prisma.sql`SELECT * FROM "account" WHERE "number" = ${number} FOR UPDATE`,
      );

      if (!account) {
        this.logger.error(`Account not found for number ${number}`);
        throw new ResourceNotFoundError();
      }

      if (account.balance < amount) {
        this.logger.error(`Insufficient funds for account ${number}`);
        throw new InsuficientFundsError();
      }

      await client.account.update({
        where: { number },
        data: { balance: { decrement: amount } },
      });

      this.logger.info(`Account ${number} balance decremented by ${amount}`);

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

    this.logger.info(
      `Withdrawal transaction completed with ID: ${transaction.id}`,
    );

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
    this.logger.info(
      `Starting transfer from account ${fromAccount} to ${toAccount} with amount ${amount}`,
    );

    const transaction = await prisma.$transaction(async (client) => {
      const from = await client.$queryRaw<Account>(
        Prisma.sql`SELECT * FROM "account" WHERE "number" = ${fromAccount} FOR UPDATE`,
      );

      if (!from) {
        this.logger.error(`Source account not found for number ${fromAccount}`);
        throw new ResourceNotFoundError();
      }

      if (from.balance < amount) {
        this.logger.error(`Insufficient funds for account ${fromAccount}`);
        throw new InsuficientFundsError();
      }

      const to = await client.$queryRaw<Account>(
        Prisma.sql`SELECT * FROM "account" WHERE "number" = ${toAccount} FOR UPDATE`,
      );

      if (!to) {
        this.logger.error(
          `Destination account not found for number ${toAccount}`,
        );
        throw new ResourceNotFoundError();
      }

      await client.account.update({
        where: { number: fromAccount },
        data: { balance: { decrement: amount } },
      });

      this.logger.info(
        `Account ${fromAccount} balance decremented by ${amount}`,
      );

      await client.account.update({
        where: { number: toAccount },
        data: { balance: { increment: amount } },
      });

      this.logger.info(`Account ${toAccount} balance incremented by ${amount}`);

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

    this.logger.info(
      `Transfer transaction completed with ID: ${transaction.id}`,
    );

    return new Transaction({
      id: transaction.id,
      type: transaction.type as TransactionTypeEnum,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
    });
  }
}
