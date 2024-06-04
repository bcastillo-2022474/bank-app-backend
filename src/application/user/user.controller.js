import { StatusCodes } from "http-status-codes";
import User from "../user/user.model.js";
import Account from "../account/account.model.js";
import mongoose from "mongoose";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js"; // Ajusta la ruta según sea necesario
import { logger } from "../../utils/logger.js";
import { cleanObject } from "../../utils/clean-object.js";
import { getError } from "../currency/currency.error.js";
import { response } from "express";
import { UserNotFound } from "./user.error.js";

export const createUserWithAccount = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    logger.info("Start create User account ednpoint");
    const {
      email,
      username,
      password,
      name,
      last_name,
      address,
      DPI,
      phone_number,
      job_name,
      monthly_income,
      currency_income,
    } = req.body;

    // Crear la cuenta
    const accountData = {
      owner: undefined, // Se asignará después de crear el usuario
      currency: currency_income,
      balance: 0,
      tp_status: "ACTIVE",
    };

    logger.info("Creating Account model");
    const newAccount = new Account(cleanObject(accountData));

    // Crear el usuario con la cuenta principal asignada
    const userDataWithMainAccount = {
      email,
      username,
      password,
      name,
      last_name,
      address,
      DPI,
      phone_number,
      job_name,
      monthly_income,
      currency_income,
      main_account: newAccount._id,
      accounts: [newAccount._id],
    };

    const newUser = new User(cleanObject(userDataWithMainAccount));
    await newUser.save({ session });
    newAccount.owner = newUser._id;

    logger.info("Saving account");
    await newAccount.save({ session });

    res.status(StatusCodes.CREATED).json({
      message: LL.USER.CONTROLLER.USER_CREATED(),
      data: newUser,
    });

    await session.commitTransaction();
    session.endSession();
    logger.info("User create endpoint ended successfully");
  } catch (error) {
    session.abortTransaction();
    const { code, stack, type } = getError(error);

    logger.error("Create User controller error of type: ", type);
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  } finally {
    session.endSession();
  }
};

export const getAllUsers = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all users with accounts");

    const { limit = 0, page = 0 } = req.query;
    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.find()
        .limit(limit)
        .skip(limit * page),
    ]);
    logger.info("no jalo");
    res.status(StatusCodes.OK).json({
      message: LL.USER.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: users,
      total,
    });

    logger.info("Users with accounts retrieved successfully");
  } catch (error) {
    const { code, stack, type } = getError(error);

    logger.error(
      "Get all users with accounts controller error of type: ",
      type,
    );
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};

export const getUserAccountsById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get user accounts by ID");

    const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la solicitud

    // Busca el usuario por su ID y poblamos las cuentas asociadas
    const user = await User.findById(userId).populate("main_account accounts");

    if (!user) {
      throw new UserNotFound(LL.USER.CONTROLLER.USER_NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      message: LL.USER.CONTROLLER.USER_ACCOUNTS_RETRIEVED_SUCCESSFULLY(),
      data: user,
    });

    logger.info("User accounts retrieved successfully");
  } catch (error) {
    const { code, stack, type } = getError(error);

    logger.error("Get user accounts by ID controller error of type: ", type);
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};
