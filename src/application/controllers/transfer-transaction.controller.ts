import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { TransferTransactionService } from '../../domain/services/transfer-transaction.service';
import { TransactionsRepository } from '../../infra/database/prisma/repositories/transactions.repository';

export async function withdrawalTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const transferTransactionParams = z.object({
    from: z.number().int().positive(),
    to: z.number().int().positive(),
    amount: z.number().min(0),
  });

  const { from, to, amount } = transferTransactionParams.parse(request.body);

  const transactionsRepository = new TransactionsRepository();
  const transferTransactionService = new TransferTransactionService(
    transactionsRepository,
  );

  const result = await transferTransactionService.execute({
    fromAccount: from,
    toAccount: to,
    amount,
  });

  return reply.status(201).send(result);
}
