import { StatusCodes } from "http-status-codes";

export class TransactionExceedsMaxWithdrawalError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.name = "TransactionExceedsMaxWithdrawalError";
  }
}
