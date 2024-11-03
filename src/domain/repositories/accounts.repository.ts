import { Prisma } from '@prisma/client';
import { Account } from '../entities/account';

export interface IAccountsRepository {
  register(account: Prisma.AccountCreateInput): Promise<Account>;
}
