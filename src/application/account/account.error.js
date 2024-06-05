import { getErrorFromErrors } from "../../utils/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class AccountAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "AccountAlreadyExist";
  }
}

export class AccountNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "AccountNotFound";
  }
}

export class AccountInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.name = "AccountInvalidValue";
  }
}

const errors = [
  {
    code: StatusCodes.NOT_FOUND,
    classes: [AccountNotFound],
  },
  {
    code: StatusCodes.CONFLICT,
    classes: [AccountAlreadyExist],
  },
  {
    code: StatusCodes.BAD_REQUEST,
    classes: [AccountInvalidValue],
  },
];

export const getError = (error) => getErrorFromErrors(error, errors);
