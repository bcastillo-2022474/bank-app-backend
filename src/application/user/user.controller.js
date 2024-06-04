import { StatusCodes } from "http-status-codes";
import User from "../user/user.model.js";
import Account from "../account/account.model.js";
import mongoose from "mongoose";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js"; // Ajusta la ruta según sea necesario
import { logger } from "../../utils/logger.js";
import { cleanObject } from "../../utils/clean-object.js";
import { getError } from "../currency/currency.error.js";

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
