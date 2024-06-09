import { logger } from "./logger.js";
import { StatusCodes } from "http-status-codes";

export function handleResponse(res, error, LL) {
  logger.error(error.stack);
  const isCustom = error.name !== "Error";
  const message = isCustom
    ? error.message
    : LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR();
  // eslint-disable-next-line @joao-cst/enforce-consistent-return-express
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message,
  });
}
