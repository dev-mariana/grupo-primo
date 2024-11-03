import { Prisma } from '@prisma/client';
import { Account } from '../../../../domain/entities/account';
import { IAccountRepository } from '../../../../domain/repositories/account.repository';
import { prisma } from '../index';

export class AccountRepository implements IAccountRepository {
  async register(account: Prisma.AccountCreateInput): Promise<Account> {
    const data = await prisma.account.create({ data: account });

    return new Account({
      id: data.id,
      number: data.number,
      balance: data.balance,
    });
  }
}
