import { AccountsRepository } from '../../infra/database/prisma/repositories/accounts.repository';

interface RegisterAccountRequest {
  number: number;
  balance: number;
}

interface RegisterAccountResponse {
  id: string;
}

export class RegisterAccountService {
  constructor(private readonly accountRepository: AccountsRepository) {}

  async execute(
    account: RegisterAccountRequest,
  ): Promise<RegisterAccountResponse> {
    const data = await this.accountRepository.register({
      number: account.number,
      balance: account.balance,
    });

    return {
      id: data.id,
    };
  }
}
