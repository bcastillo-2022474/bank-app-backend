import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateChecks = async (req, res, next) => {
  const result = validationResult(req);
  // console.log({ errors: result.array() });
  if (!result.isEmpty()) {
    // eslint-disable-next-line @joao-cst/enforce-consistent-return-express
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: result.array(), message: "Invalid request" });
  }

  return next();
};
