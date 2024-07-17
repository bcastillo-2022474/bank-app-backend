import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { getTranslationFunctions } from "./get-translations-locale.js";

class TokenGenerationError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenGenerationError";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export const generateToken = async (payload, req) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
      algorithm: "HS256",
    });
  } catch {
    throw new TokenGenerationError(LL.GENERAL.ERROR.GENERATE_TOKEN());
  }
};
