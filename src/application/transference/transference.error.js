import { StatusCodes } from "http-status-codes";

export class NotSameCurrencyError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "NotSameCurrencyError";
  }
}

export class NotSameCurrencyAccountsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "NotSameCurrencyAccountsError";
  }
}

export class TransferenceNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "TransferenceNotFound";
  }
}
