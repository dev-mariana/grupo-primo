import { TransactionsRepository } from '../../infra/database/prisma/repositories/transactions.repository';
import { TransactionTypeEnum } from '../enum/transaction-type.enum';

interface DepositTransactionRequest {
  accountNumber: number;
  amount: number;
}

interface DepositTransactionResponse {
  type: TransactionTypeEnum;
  from: number | null;
  to: number | null;
  amount: number;
}

export class DepositTransactionService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    accountNumber,
    amount,
  }: DepositTransactionRequest): Promise<DepositTransactionResponse> {
    return await this.transactionsRepository.deposit(accountNumber, amount);
  }
}
