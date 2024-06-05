import { StatusCodes } from "http-status-codes";

export class ServiceAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "ServiceAlreadyExist";
  }
}

export class ServiceNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "ServiceNotFound";
  }
}

export class ServiceInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "ServiceInvalidValue";
  }
}
