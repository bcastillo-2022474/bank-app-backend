import { logger } from "../utils/logger.js";

export const printLanguage = async (req, _, next) => {
  logger.info(
    {
      languageReceived: req.headers["accept-language"],
    },
    "Language",
  );
  next();
};
