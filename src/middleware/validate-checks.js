import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { getTranslationFunctions } from "../utils/get-translations-locale.js";

export const validateChecks = async (req, res, next) => {
  const LL = getTranslationFunctions(req.locale);
  const result = validationResult.withDefaults({
    formatter(error) {
      // @ts-ignore
      return `${error.location}[${error.path}]: ${error.msg}`;
    },
  })(req);

  if (!result.isEmpty()) {
    // eslint-disable-next-line @joao-cst/enforce-consistent-return-express
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: [...new Set(result.array())],
      message: LL.GENERAL.ROUTES.INVALID_REQUEST(),
    });
  }

  return next();
};
