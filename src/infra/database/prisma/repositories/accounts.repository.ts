import { Prisma } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import { Account } from '../../../../domain/entities/account';
import { IAccountsRepository } from '../../../../domain/repositories/accounts.repository';
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error';
import { prisma } from '../index';

export class AccountsRepository implements IAccountsRepository {
  private readonly logger: FastifyLoggerInstance;

  async register(account: Prisma.AccountCreateInput): Promise<Account> {
    this.logger.info(
      `Attempting to register account with number: ${account.number}`,
    );

    const data = await prisma.account.findUnique({
      where: { number: account.number },
    });

    if (data) {
      this.logger.warn(
        `Account registration failed - account with number ${account.number} already exists`,
      );

      throw new ResourceAlreadyExistsError();
    }

    const createdAccount = await prisma.account.create({ data: account });

    this.logger.info(
      `Account successfully registered with ID: ${createdAccount.id} and number: ${createdAccount.number}`,
    );

    return new Account({
      id: createdAccount.id,
      number: createdAccount.number,
      balance: createdAccount.balance,
    });
  }
}
