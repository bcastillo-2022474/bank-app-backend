import Transference, { INACTIVE } from "./transference.model.js";
import Account from "../account/account.model.js";
import { AccountInsufficientFundsError } from "../account/account.error.js";
import {
  NotSameQurrencyAccountsError,
  NotSameQurrencyError,
} from "../transference/transference.error.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import mongoose from "mongoose";

export const createTransference = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const LL = getTranslationFunctions(req.locate);
  try {
    logger.info("Starting generate a transference");

    const { account_given, account_reciver, quantity, currency } = req.body;

    const account_g = await Account.findById(account_given);
    const account_r = await Account.findById(account_reciver);

    if (account_g.currency !== account_r.currency) {
      throw new NotSameQurrencyAccountsError(
        LL.TRANSFERENCE.ERROR.NOT_SAME_CURRENCY_ACCOUNTS(),
      );
    }

    if (account_g.currency !== currency) {
      throw new NotSameQurrencyError(LL.TRANSFERENCE.ERROR.NOT_SAME_CURRENCY());
    }

    if (account_g.balance < quantity) {
      throw new AccountInsufficientFundsError(
        LL.TRANSFERENCE.ERROR.INSUFFICIENT_FOUNDS(),
      );
    }

    account_g.balance -= quantity;
    account_r.balance += quantity;

    const transference = new Transference(
      cleanObject({
        account_given,
        account_reciver,
        quantity,
        currency,
      }),
    );

    await transference.save();
    await account_g.save();
    await account_r.save();
    await session.commitTransaction();

    res.status(StatusCodes.CREATED).json({
      message: LL.TRANSFERENCE.CONTROLLER.CREATED(),
      data: transference,
    });

    logger.info("Transferece succesfully", transference);
  } catch (error) {
    await session.abortTransaction();
    logger.error("Transference error of type: ", error.name);
    handleResponse(res, error, LL);
  } finally {
    session.endSession();
  }
};

// CANCELAR: DELETE
// cancelar transaccion cuando date.now() - `created_at` < 5 min
// tp_status: INACTIVE

// GET ALL BY USER: GET

// GET ALL BY ACCOUNT

export const getAllTransferencesByAccount = async (req, res) => {
  const LL = getTranslationFunctions(req.locate);
  try {
    logger.info("Start get all transferences by account");
    const { accountId } = req.params;
    const { limit = 0, page = 0, currency } = req.query;

    const query = cleanObject({
      account_given: accountId,
      currency,
    });

    const [total, transactions] = await Promise.all([
      Transaction.countDocuments({ account: query.account }),
      Transaction.find(query)
        .limit(limit)
        .skip(limit * page)
        // get recents first
        .sort({
          created_at: -1,
        }),
    ]);

    res.status(StatusCodes.OK).json({
      total,
      data: transactions,
      message: LL.TRANSACTION.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
    });

    logger.info("Transactions by account retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all transactions by account controller error of type: ",
      error.name,
    );
    handleResponse(res, error, LL);
  }
};
