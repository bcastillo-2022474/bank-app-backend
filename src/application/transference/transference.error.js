import { StatusCodes } from "http-status-codes";

export class NotSameQurrencyError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "NotSameQurrencyError";
  }
}

export class NotSameQurrencyAccountsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "NotSameQurrencyAccountsError";
  }
}
