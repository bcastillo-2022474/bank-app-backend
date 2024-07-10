import { StatusCodes } from "http-status-codes";

export class PurchaseNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "PurchaseNotFound";
  }
}

export class ProductNotEnoughStock extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "ProductNotEnoughStock";
  }
}
