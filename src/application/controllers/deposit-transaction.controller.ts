import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { DepositTransactionService } from '../../domain/services/deposit-transaction.service';
import { TransactionsRepository } from '../../infra/database/prisma/repositories/transactions.repository';

export async function depositTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const depositTransactionParams = z.object({
    accountNumber: z.number().int().positive(),
    amount: z.number().min(0),
  });

  const { accountNumber, amount } = depositTransactionParams.parse(
    request.body,
  );

  const transactionsRepository = new TransactionsRepository();
  const depositTransactionService = new DepositTransactionService(
    transactionsRepository,
  );

  const result = await depositTransactionService.execute({
    accountNumber,
    amount,
  });

  return reply.status(201).send(result);
}
