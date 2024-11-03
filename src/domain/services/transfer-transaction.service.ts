import { TransactionsRepository } from '../../infra/database/prisma/repositories/transactions.repository';
import { TransactionTypeEnum } from '../enum/transaction-type.enum';

interface TransferTransactionRequest {
  fromAccount: number;
  toAccount: number;
  amount: number;
}

interface TransferTransactionResponse {
  type: TransactionTypeEnum;
  from: number | null;
  to: number | null;
  amount: number;
}

export class TransferTransactionService {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    fromAccount,
    toAccount,
    amount,
  }: TransferTransactionRequest): Promise<TransferTransactionResponse> {
    return await this.transactionsRepository.transfer(
      fromAccount,
      toAccount,
      amount,
    );
  }
}
