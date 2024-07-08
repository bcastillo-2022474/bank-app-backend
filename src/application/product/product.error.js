import { StatusCodes } from "http-status-codes";

export class ProductAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "ProductAlreadyExist";
  }
}

export class ProductNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "ProductNotFound";
  }
}

export class InsufficientStock extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.name = "InsufficientStock";
  }
}

export class ProductInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "ProductInvalidValue";
  }
}
