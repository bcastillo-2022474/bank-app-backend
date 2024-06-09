import { StatusCodes } from "http-status-codes";

export class AccountAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "AccountAlreadyExist";
  }
}

export class AccountNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "AccountNotFound";
  }
}

export class AccountInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "AccountInvalidValue";
  }
}
