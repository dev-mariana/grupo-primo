export class Account {
  id: string;
  number: number;
  balance: number;

  constructor(data: Account) {
    this.id = data.id;
    this.number = data.number;
    this.balance = data.balance;
  }
}
