import { TransactionTypeEnum } from '../enum/transaction-type.enum';

export class Transaction {
  id: string;
  type: TransactionTypeEnum;
  origin: string | null;
  destination: string | null;
  amount: number;

  constructor(data: Transaction) {
    this.id = data.id;
    this.type = data.type;
    this.origin = data.origin;
    this.destination = data.destination;
    this.amount = data.amount;
  }
}
