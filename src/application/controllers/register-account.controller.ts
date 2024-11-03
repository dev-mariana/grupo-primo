import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { RegisterAccountService } from '../../domain/services/register-account.service';
import { AccountRepository } from '../../infra/database/prisma/repositories/account.repository';

export async function registerAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerAccountParams = z.object({
    number: z.number().int().positive(),
    balance: z.number().min(0),
  });

  const { number, balance } = registerAccountParams.parse(request.body);

  const accountRepository = new AccountRepository();
  const registerAccountService = new RegisterAccountService(accountRepository);

  const result = await registerAccountService.execute({ number, balance });

  return reply.status(201).send(result);
}
