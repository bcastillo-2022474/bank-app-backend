export class CurrencyAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "CurrencyAlreadyExist";
  }
}
