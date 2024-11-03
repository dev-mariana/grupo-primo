import { FastifyInstance } from 'fastify';
import { registerAccount } from './register-account.controller';

export async function accountsRoutes(app: FastifyInstance) {
  app.post('/accounts/register', registerAccount);
}
