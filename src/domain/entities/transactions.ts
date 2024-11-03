import { TransactionTypeEnum } from '../enum/transaction-type.enum';

export class Transaction {
  id: string;
  type: TransactionTypeEnum;
  from: number | null;
  to: number | null;
  amount: number;

  constructor(data: Transaction) {
    this.id = data.id;
    this.type = data.type;
    this.from = data.from;
    this.to = data.to;
    this.amount = data.amount;
  }
}
