import { response } from "express";
import Account, { INACTIVE } from "./account.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { AccountNotFound, getAccountError } from "./account.model.js";
import { cleanObject } from "../../utils/clean-object.js";

export const getAllAccounts = async (req, res = response) => {
    const LL = getTranslationFunctions(req.locale);
    try {
      logger.info("Starting get all accounts");
  
      const { limit = 0, page = 0 } = req.query;
      console.log({ limit, page });
      const [total, accounts] = await Promise.all([
        Account.countDocuments(),
        Account.find()
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
      const { code, stack, type } = getAccountError(error);
  
      logger.error("Get all accounts controller error of type: ", type);
      logger.error(stack);
  
      res.status(code).json({
        message: LL.INTERNAL_SERVER_ERROR(),
        error,
      });
    }
  };
  
  export const createAccount = async (req, res) => {
    const LL = getTranslationFunctions(req.locale);
    try {
      logger.info("Starting create account");
  
      const { owner, currency, balance, tp_status } = req.body;
  
      const account = new Account({
        owner,
        currency,
        balance,
        tp_status,
      });
  
      await account.save();
  
      res.status(StatusCodes.CREATED).json({
        message: LL.ACCOUNT.CONTROLLER.CREATED(),
        data: account,
      });
  
      logger.info("Account created successfully", account);
    } catch (error) {
      const { code, stack, type } = getAccountError(error);
  
      logger.error("Create account controller error of type:", type);
      logger.error(stack);
  
      res.status(code).json({
        message: LL.INTERNAL_SERVER_ERROR(),
        error,
      });
    }
  };
  
  export const updateAccount = async (req, res) => {
    const LL = getTranslationFunctions(req.locale);
    try {
      logger.info("Starting update account");
  
      const { id } = req.params;
      const { balance, tp_status } = req.body;
  
      const account = await Account.findByIdAndUpdate(
        id,
        cleanObject({ owner, currency, balance }),
        { new: true },
      );
  
      if (!account) {
        throw new AccountNotFound(LL.ACCOUNT.ERROR.ACCOUNT_NOT_FOUND());
      }
  
      res.status(StatusCodes.OK).json({
        message: LL.ACCOUNT.CONTROLLER.UPDATED(),
        data: account,
      });
  
      logger.info("Account updated successfully", account);
    } catch (error) {
      const { code, stack, type } = getAccountError(error);
  
      logger.error("Update account controller error of type:", type);
      logger.error(stack);
  
      res.status(code).json({
        message: LL.INTERNAL_SERVER_ERROR(),
        error,
      });
    }
  };
  
  export const deleteAccountById = async (req, res) => {
    const LL = getTranslationFunctions(req.locale);
    try {
      logger.info("Starting delete account by id");
  
      const { id } = req.params;
      const account = await Account.findByIdAndDelete(
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
      const { code, stack, type } = getAccountError(error);
  
      logger.error("Delete account controller error of type:", type);
      logger.error(stack);
  
      res.status(code).json({
        message: LL.INTERNAL_SERVER_ERROR(),
        error,
      });
    }
  };