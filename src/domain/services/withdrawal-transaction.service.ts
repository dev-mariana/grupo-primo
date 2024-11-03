import { TransactionsRepository } from '../../infra/database/prisma/repositories/transactions.repository';
import { TransactionTypeEnum } from '../enum/transaction-type.enum';

interface WithdrawalTransactionRequest {
  accountNumber: number;
  amount: number;
}

interface WithdrawalTransactionResponse {
  type: TransactionTypeEnum;
  from: number | null;
  to: number | null;
  amount: number;
}

export class WithdrawalTransactionService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    accountNumber,
    amount,
  }: WithdrawalTransactionRequest): Promise<WithdrawalTransactionResponse> {
    return await this.transactionsRepository.withdrawal(accountNumber, amount);
  }
}
