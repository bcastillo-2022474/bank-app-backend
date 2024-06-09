import { logger } from "../../utils/logger.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import User, { ACTIVE } from "../user/user.model.js";
import Transaction, { DEPOSIT } from "./transaction.model.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";
import Account from "../account/account.model.js";

export const createTransaction = async (req, res) => {
  const session = await Transaction.startSession();
  session.startTransaction();
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start create transaction");
    const { amount, account, type, currency } = req.body;

    const transaction = new Transaction({
      amount,
      account,
      type,
      currency,
    });

    await Account.findOneAndUpdate(
      {
        _id: account,
        tp_status: ACTIVE,
      },
      {
        $inc: {
          balance: type === DEPOSIT ? amount : -amount,
        },
      },
      {
        session,
        new: true,
      },
    );

    await transaction.save();
    await session.commitTransaction();

    res.status(StatusCodes.CREATED).json({
      data: transaction,
      message: LL.TRANSACTION.CONTROLLER.CREATED(),
    });

    logger.info("Transaction created successfully");
  } catch (error) {
    await session.abortTransaction();
    logger.error("Create transaction controller error of type: ", error.name);
    handleResponse(res, error, LL);
  } finally {
    session.endSession();
  }
};

export const getAllTransactionsByUser = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start get all transactions by user");
    const { userId, currency, type } = req.params;
    const { limit, page } = req.query;

    const user = await User.findOne({
      _id: userId,
      tp_status: ACTIVE,
    });

    const query = cleanObject({
      tp_status: ACTIVE,
      account: { $in: user.accounts },
      currency,
      type,
    });

    const [total, transactions] = await Promise.all([
      Transaction.countDocuments(query),
      Transaction.find(query)
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      total,
      data: transactions,
      message: LL.TRANSACTION.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
    });

    logger.info("Transactions by user retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all transactions by user controller error of type: ",
      error.name,
    );
    handleResponse(res, error, LL);
  }
};

export const getAllTransactionsByAccount = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start get all transactions by account");
    const { accountId, currency, type } = req.params;
    const { limit, page } = req.query;

    const query = cleanObject({
      tp_status: ACTIVE,
      account: accountId,
      currency,
      type,
    });

    const [total, transactions] = await Promise.all([
      Transaction.countDocuments(query),
      Transaction.find(query)
        .limit(limit)
        .skip(limit * page),
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
