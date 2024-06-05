import { logger } from "../utils/logger.js";
import { getTranslationFunctions } from "../utils/get-translations-locale.js";
import { StatusCodes } from "http-status-codes";

/**
 * @typedef {import('../../i18n/i18n-types.js').TranslationFunctions} TranslationFunctions
 */

/**
 * @param {function(any, TranslationFunctions): void} fn
 */
export const custom = (fn) => {
  return async (req, res, next) => {
    const LL = getTranslationFunctions(req.locale);
    try {
      await fn(req, LL);
      next();
    } catch (error) {
      logger.error("Custom middleware error of type: ", error.name);
      logger.error(error.stack);

      res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
};
