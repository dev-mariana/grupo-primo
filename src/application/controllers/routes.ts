import { FastifyInstance } from 'fastify';
import { depositTransaction } from './deposit-transaction.controller';
import { registerAccount } from './register-account.controller';
import { transferTransaction } from './transfer-transaction.controller';
import { withdrawalTransaction } from './withdrawal-transaction.controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/accounts/register', registerAccount);
  app.post('/transactions/deposit', depositTransaction);
  app.post('/transactions/withdrawal', withdrawalTransaction);
  app.post('/transactions/transfer', transferTransaction);
}
