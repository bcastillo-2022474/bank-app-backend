import { getErrorFromErrors } from "../../utils/http-errors.js";
import { StatusCodes } from "http-status-codes";

export class PayoutAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = "PayoutAlreadyExist";
  }
}

export class PayoutNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "PayoutNotFound";
  }
}

export class PayoutInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.name = "PayoutInvalidValue";
  }
}

const errors = [
  {
    code: StatusCodes.NOT_FOUND,
    classes: [PayoutNotFound],
  },
  {
    code: StatusCodes.CONFLICT,
    classes: [PayoutAlreadyExist],
  },
  {
    code: StatusCodes.BAD_REQUEST,
    classes: [PayoutInvalidValue],
  },
];

export const getError = (error) => getErrorFromErrors(error, errors);
