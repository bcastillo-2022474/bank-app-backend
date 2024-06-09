import { StatusCodes } from "http-status-codes";

export class TransactionExceedsMaxWithdrawalError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "TransactionExceedsMaxWithdrawalError";
  }
}
