import { StatusCodes } from "http-status-codes";

export class AdminAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "AdminAlreadyExist";
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export class AdminNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "AdminNotFound";
  }
}
