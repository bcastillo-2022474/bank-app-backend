import { StatusCodes } from "http-status-codes";

export class UserAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "UserAlreadyExist";
  }
}

export class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "UserNotFound";
  }
}

export class UserInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "UserInvalidValue";
  }
}
