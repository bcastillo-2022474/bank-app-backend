import Transference, { INACTIVE, ACTIVE } from "./transference.model.js";
import Account from "../account/account.model.js";
import {
  AccountInsufficientFundsError,
  AccountNotFound,
} from "../account/account.error.js";
import {
  NotSameCurrencyAccountsError,
  NotSameCurrencyError,
  TransferenceNotFound,
  TransferenceCancellationExpired,
  DeniedAmount,
} from "./transference.error.JS";
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

    const account_g = await Account.findOne({
      _id: account_given,
      tp_status: ACTIVE,
    });
    const account_r = await Account.findOne({
      _id: account_reciver,
      tp_status: ACTIVE,
    });

    if (account_g.currency !== account_r.currency) {
      throw new NotSameCurrencyAccountsError(
        LL.TRANSFERENCE.ERROR.NOT_SAME_CURRENCY_ACCOUNTS(),
      );
    }

    if (account_g.currency !== currency) {
      throw new NotSameCurrencyError(LL.TRANSFERENCE.ERROR.NOT_SAME_CURRENCY());
    }

    if (quantity > 2000) {
      throw new DeniedAmount(LL.TRANSFERENCE.ERROR.AMOUNT_EXCEDDS_2000());
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

export const cancelTransference = async (req, res) => {
  const session = await Transference.startSession();
  session.startTransaction();
  const LL = getTranslationFunctions(req.locale);
  const isNow = new Date();
  try {
    logger.info("Start cancel transference");
    const { transferenceId } = req.params;

    const trans = await Transference.findOneAndUpdate(
      {
        _id: transferenceId,
        tp_status: ACTIVE,
      },
      {
        tp_status: INACTIVE,
      },
    );

    if (!trans) {
      throw new TransferenceNotFound(LL.TRANSFERENCE.ERROR.NOT_FOUND());
    }

    const diffMinutes = moment(isNow).diff(trans.create_at, "minutes");

    if (diffMinutes > 5) {
      throw new TransferenceCancellationExpired(
        LL.TRANSFERENCE.ERROR.CANCELLATION_TIME_EXPIRED(),
      );
    }

    const [account_given, account_reciver] = await Promise.all([
      Account.findById(trans.account_given),
      Account.findById(trans.account_reciver),
    ]);

    account_given.balance += trans.quantity;
    account_reciver.balance -= trans.quantity;

    await account_given.save();
    await account_reciver.save();
    await session.commitTransaction();

    res.status(StatusCodes.OK).json({
      data: trans,
      message: LL.TRANSFERENCE.CONTROLLER.DELETED(),
    });

    logger.info("Cancel transference successfully");
  } catch (error) {
    await session.abortTransaction();
    logger.error("Cancel transaction controller error of type: ", error.name);
    handleResponse(res, error, LL);
  } finally {
    session.endSession();
  }
};

// GET ALL BY USER: GET
export const getAllTransferencesByUser = async (req, res) => {
  const LL = getTranslationFunctions(req.locate);
  try {
    logger.info("Start get all transferences by account");
    const { userId } = req.params;
    const { limit = 0, page = 0, currency } = req.query;

    const account_g = await Account.findOne({ owner: userId });

    if (!account_g) {
      throw new AccountNotFound(LL.USER.ERROR.ACCOUNT_NOT_FOUND());
    }

    const query = cleanObject({
      account_given: account_g.owner,
      currency,
    });

    const [total, transactions] = await Promise.all([
      Transference.countDocuments({ account: query.account }),
      Transference.find(query)
        .limit(limit)
        .skip(limit * page)

        .sort({
          created_at: -1,
        }),
    ]);

    res.status(StatusCodes.OK).json({
      total,
      data: transactions,
      message: LL.TRANSFERENCE.CONTROLLER.RETRIEVED_FOR_USER_SUCCESSFULLY(),
    });

    logger.info("Transferencess by user retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all transferences by user controller error of type: ",
      error.name,
    );
    handleResponse(res, error, LL);
  }
};
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
      Transference.countDocuments({ account: query.account }),
      Transference.find(query)
        .limit(limit)
        .skip(limit * page)

        .sort({
          created_at: -1,
        }),
    ]);

    res.status(StatusCodes.OK).json({
      total,
      data: transactions,
      message: LL.TRANSFERENCE.CONTROLLER.RETRIEVED_FOR_ACCOUNT_SUCCESSFULLY(),
    });

    logger.info("Transferencess by account retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all transferences by account controller error of type: ",
      error.name,
    );
    handleResponse(res, error, LL);
  }
};
