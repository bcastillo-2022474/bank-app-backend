import { StatusCodes } from "http-status-codes";

export class CurrencyAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "CurrencyAlreadyExist";
  }
}

export class CurrencyNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "CurrencyNotFound";
  }
}

export class CurrencyInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "CurrencyInvalidValue";
  }
}
