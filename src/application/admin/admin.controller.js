import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import Admin, { ACTIVE, INACTIVE } from "./admin.model.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import { StatusCodes } from "http-status-codes";
import { AdminNotFound } from "../admin/admin.error.js";
import { cleanObject } from "../../utils/clean-object.js";

export const createAdmin = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start create admin");

    const { email, username, password, name, last_name } = req.body;

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

export const getAllAdmins = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start get all admins");

    const { limit = 0, page = 0 } = req.query;

    const query = {
      tp_status: ACTIVE,
    };

    const [total, admins] = await Promise.all([
      Admin.countDocuments(query),
      Admin.find(query)
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      data: admins,
      message: LL.ADMIN.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      total,
    });

    logger.info("Get all admins successfully");
  } catch (error) {
    logger.error("Get all admins controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const updateAdmin = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start update admin");

    const { id } = req.params;
    const { username, password, name, last_name } = req.body;

    const adminUpdated = await Admin.findOneAndUpdate(
      { _id: id, tp_status: ACTIVE },
      cleanObject({
        username,
        password,
        name,
        last_name,
        updated_at: Date.now(),
      }),
      { new: true },
    );

    if (!adminUpdated) {
      throw new AdminNotFound(LL.ADMIN.ERROR.NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      data: adminUpdated,
      message: LL.ADMIN.CONTROLLER.UPDATED(),
    });

    logger.info("Update admin successfully");
  } catch (error) {
    logger.error("Update admin controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const deleteAdminById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start delete admin by id");

    const { id } = req.params;

    const adminDeleted = await Admin.findOneAndUpdate(
      { _id: id, tp_status: ACTIVE },
      { tp_status: INACTIVE, updated_at: Date.now() },
      { new: true },
    );

    if (!adminDeleted) {
      throw new AdminNotFound(LL.ADMIN.ERROR.NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      data: adminDeleted,
      message: LL.ADMIN.CONTROLLER.DELETED(),
    });

    logger.info("Delete admin by id successfully");
  } catch (error) {
    logger.error("Delete admin by id controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};
