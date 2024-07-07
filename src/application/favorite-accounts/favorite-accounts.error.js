import { StatusCodes } from "http-status-codes";

export class FavoriteAccountsAlreadyExist extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.name = "FavoriteAccountsAlreadyExist";
  }
}

export class FavoriteAccountsNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.name = "FavoriteAccountsNotFound";
  }
}

export class FavoriteAccountsInvalidValue extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.name = "FavoriteAccountsInvalidValue";
  }
}
