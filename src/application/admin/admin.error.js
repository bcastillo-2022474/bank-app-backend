import { StatusCodes } from "http-status-codes";

export class AdminAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "AdminAlreadyExist";
    this.statusCode = StatusCodes.CONFLICT;
  }
}
