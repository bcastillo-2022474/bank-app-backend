import { getErrorFromErrors } from "../../utils/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class ServiceAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceAlreadyExist";
  }
}

export class ServiceNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceNotFound";
  }
}

export class ServiceInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceInvalidValue";
  }
}

const errors = [
  {
    code: StatusCodes.NOT_FOUND,
    classes: [ServiceNotFound],
  },
  {
    code: StatusCodes.CONFLICT,
    classes: [ServiceAlreadyExist],
  },
  {
    code: StatusCodes.BAD_REQUEST,
    classes: [ServiceInvalidValue],
  },
];

export const getError = (error) => getErrorFromErrors(error, errors);
