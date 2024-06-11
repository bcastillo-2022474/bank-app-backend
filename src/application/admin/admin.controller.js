import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import Admin, { ACTIVE, INACTIVE } from "./admin.model.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";

export const createAdmin = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start create admin");

    const { email, username, password, name, last_name } = req.body;

    // Create admin
    const admin = new Admin({
      email,
      username,
      password,
      name,
      last_name,
    });

    await admin.save();

    res.status(StatusCodes.CREATED).json({
      data: admin,
      message: LL.ADMIN.CONTROLLER.CREATED(),
    });

    logger.info("Admin created successfully");
  } catch (error) {
    logger.error("Create admin controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};
