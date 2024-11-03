import { Prisma } from '@prisma/client';
import { Account } from '../entities/account';

export interface IAccountRepository {
  register(account: Prisma.AccountCreateInput): Promise<Account>;
}
