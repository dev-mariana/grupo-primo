export class InsuficientFundsError extends Error {
  constructor() {
    super('Insufficient funds in source account.');
  }
}
