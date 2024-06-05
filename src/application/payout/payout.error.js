import { StatusCodes } from "http-status-codes";

export class PayoutNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "PayoutNotFound";
  }
}

export class PayoutInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "PayoutInvalidValue";
  }
}
