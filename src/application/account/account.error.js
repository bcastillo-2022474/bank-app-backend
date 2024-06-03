export class AccountNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "AccountNotFound";
  }
}
