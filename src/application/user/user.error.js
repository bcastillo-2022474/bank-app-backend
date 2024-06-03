import { getErrorFromErrors } from "../../utils/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class UserAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "UserAlreadyExist";
  }
}

export class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFound";
  }
}

export class UserInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.name = "UserInvalidValue";
  }
}

const errors = [
  {
    code: StatusCodes.NOT_FOUND,
    classes: [UserNotFound],
  },
  {
    code: StatusCodes.CONFLICT,
    classes: [UserAlreadyExist],
  },
  {
    code: StatusCodes.BAD_REQUEST,
    classes: [UserInvalidValue],
  },
];

export const getError = (error) => getErrorFromErrors(error, errors);
