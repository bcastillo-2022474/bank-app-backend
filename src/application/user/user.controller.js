import { StatusCodes } from "http-status-codes";
import User, { ACTIVE } from "../user/user.model.js";
import Account from "../account/account.model.js";
import mongoose from "mongoose";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";
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
      initial_balance,
    } = req.body;

    // Crear la cuenta
    const accountData = {
      owner: undefined, // Se asignará después de crear el usuario
      currency: currency_income,
      balance: initial_balance,
      tp_status: ACTIVE,
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

    logger.info("Saving user");
    await newUser.save({ session });
    newAccount.owner = newUser._id;

    logger.info("Saving account");
    await newAccount.save({ session });

    await newUser.populate("main_account");

    await session.commitTransaction();
    res.status(StatusCodes.CREATED).json({
      message: LL.USER.CONTROLLER.USER_CREATED(),
      data: newUser,
    });

    logger.info("User create endpoint ended successfully");
  } catch (error) {
    session.abortTransaction();
    logger.error("Create User controller error of type: ", error.name);
    handleResponse(res, error, LL);
  } finally {
    session.endSession();
  }
};

export const getAllUsers = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all users with accounts");

    const { limit = 0, page = 0 } = req.query;

    const query = {
      tp_status: ACTIVE,
    };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.USER.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: users,
      total,
    });

    logger.info("Users with accounts retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all users with accounts controller error of type: ",
      error.name,
    );
    handleResponse(res, error, LL);
  }
};

export const getUserById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get user by ID");

    const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la solicitud

    // Busca el usuario por su ID
    const user = await User.findOne({
      _id: id,
      tp_status: ACTIVE,
    }).populate("accounts main_account");

    if (!user) {
      throw new UserNotFound(LL.USER.CONTROLLER.USER_NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
      message: LL.USER.CONTROLLER.RETRIEVED_SUCCESSFULLY(),
      data: user,
    });

    logger.info("User retrieved successfully");
  } catch (error) {
    logger.error("Get user by ID controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};
