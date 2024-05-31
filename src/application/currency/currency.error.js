import { getErrorFromErrors } from "../../utils/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class CurrencyAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "CurrencyAlreadyExist";
  }
}

export class CurrencyNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "CurrencyNotFound";
  }
}

export class CurrencyInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.name = "CurrencyInvalidValue";
  }
}

const errors = [
  {
    code: StatusCodes.NOT_FOUND,
    classes: [CurrencyNotFound],
  },
  {
    code: StatusCodes.CONFLICT,
    classes: [CurrencyAlreadyExist],
  },
  {
    code: StatusCodes.BAD_REQUEST,
    classes: [CurrencyInvalidValue],
  },
];

export const getError = (error) => getErrorFromErrors(error, errors);
