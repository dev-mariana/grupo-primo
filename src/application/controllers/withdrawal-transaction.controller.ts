import { FastifyLoggerInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { WithdrawalTransactionService } from '../../domain/services/withdrawal-transaction.service';
import { TransactionsRepository } from '../../infra/database/prisma/repositories/transactions.repository';

export async function withdrawalTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const withdrawalTransactionParams = z.object({
    accountNumber: z.number().int().positive(),
    amount: z.number().min(0),
  });

  const { accountNumber, amount } = withdrawalTransactionParams.parse(
    request.body,
  );

  let logger: FastifyLoggerInstance = request.log;
  const transactionsRepository = new TransactionsRepository(logger);
  const withdrawalTransactionService = new WithdrawalTransactionService(
    transactionsRepository,
  );

  const result = await withdrawalTransactionService.execute({
    accountNumber,
    amount,
  });

  return reply.status(201).send(result);
}
