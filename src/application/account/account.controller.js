import { response } from "express";
import Account, { ACTIVE, INACTIVE } from "./account.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { AccountNotFound } from "./account.error.js";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";

export const getAllAccounts = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all accounts");

    const { limit = 0, page = 0 } = req.query;
    const query = { tp_status: ACTIVE };
    const [total, accounts] = await Promise.all([
      Account.countDocuments(query),

      Account.find(query)
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.ACCOUNT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: accounts,
      total,
    });

    logger.info("Accounts retrieved successfully");
  } catch (error) {
    logger.error("Get all accounts controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const createAccount = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting create account");

    const { owner, currency, balance } = req.body;

    const account = new Account({
      owner,
      currency,
      balance,
    });

    await account.save();

    res.status(StatusCodes.CREATED).json({
      message: LL.ACCOUNT.CONTROLLER.CREATED(),
      data: account,
    });

    logger.info("Account created successfully", account);
  } catch (error) {
    logger.error("Create account controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};

export const updateAccount = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting update account");

    const { id } = req.params;
    const { owner, currency, balance } = req.body;

    const updateData = cleanObject({
      owner,
      currency,
      balance,
      updated_at: new Date(),
    });

    const account = await Account.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!account) {
      throw new AccountNotFound(LL.ACCOUNT.ERROR.ACCOUNT_NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      message: LL.ACCOUNT.CONTROLLER.UPDATED(),
      data: account,
    });

    logger.info("Account updated successfully", account);
  } catch (error) {
    logger.error("Update account controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};

export const deleteAccountById = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting delete account by id");

    const { id } = req.params;
    const account = await Account.findByIdAndUpdate(
      id,
      { tp_status: INACTIVE },
      { new: true },
    );
    res.status(StatusCodes.OK).json({
      message: LL.ACCOUNT.CONTROLLER.DELETED(),
      data: account,
    });

    logger.info("Account deleted successfully", account);
  } catch (error) {
    logger.error("Delete account controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};
