import bcryptjs from "bcryptjs";
import { logger } from "./logger.js";

export const encrypt = (password) => {
  logger.info("ENCRIPTTTTTTTTTTT UTILIDAD");
  const salt = bcryptjs.genSaltSync();
  const encryptedPassword = bcryptjs.hashSync(password, salt);
  return encryptedPassword;
};
