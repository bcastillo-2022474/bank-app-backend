import { Router } from "express";
import { body, param, query } from "express-validator";
import Transaction, {
  DEPOSIT,
  MAX_WITHDRAWAL_PER_TRANSACTION,
  WITHDRAWAL,
} from "./transaction.model.js";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import { custom } from "../../middleware/custom.js";
import {
  AccountDailyQuotaExceededError,
  AccountNotFound,
} from "../account/account.error.js";
import Account, { ACTIVE } from "../account/account.model.js";
import Currency from "../currency/currency.model.js";
import { CurrencyNotFound } from "../currency/currency.error.js";
import User, { MAX_DAILY_QUOTA } from "../user/user.model.js";
import {
  createTransaction,
  getAllTransactionsByAccount,
  getAllTransactionsByUser,
} from "./transaction.controller.js";
import { TransactionExceedsMaxWithdrawalError } from "./transaction.error.js";

const router = Router();

router.route("/").post([
  body(
    "account",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_ACCOUNT()),
  ).isMongoId(),
  body(
    "type",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_TYPE()),
  )
    .isString()
    .isIn([DEPOSIT, WITHDRAWAL]),
  body(
    "amount",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_AMOUNT()),
  ).isFloat({ min: 0 }),
  body(
    "currency",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_CURRENCY()),
  ).isMongoId(),
  validateChecks,
  custom(async (req, LL) => {
    const { account } = req.body;
    // check if account exists
    const accountFound = await Account.findOne({
      _id: account,
      tp_status: ACTIVE,
    });

    if (!accountFound) {
      throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
    }
  }),
  custom(async (req, LL) => {
    const { currency } = req.body;
    // check if currency exists
    const currencyFound = await Currency.findOne({
      _id: currency,
      tp_status: ACTIVE,
    });

    if (!currencyFound) {
      throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
    }
  }),
  custom(async (req, LL) => {
    const { amount, type } = req.body;
    if (type === WITHDRAWAL && amount > MAX_WITHDRAWAL_PER_TRANSACTION) {
      throw new TransactionExceedsMaxWithdrawalError(
        LL.TRANSACTION.ERROR.EXCEEDED_MAX_WITHDRAWAL_PER_TRANSACTION(),
      );
    }
  }),
  custom(async (req, LL) => {
    const { account, amount, type } = req.body;
    // if its not a withdrawal, skip
    if (type !== WITHDRAWAL) return;

    const dailyQuota = await Transaction.aggregate([
      // filters all WITHDRAWAL transactions of the day made by the account
      {
        $match: {
          account: account._id,
          type: WITHDRAWAL,
          created_at: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      },
      // groups and sums all WITHDRAWAL transactions
      {
        $group: {
          // MUST USE `_id: null` TO GROUP ALL DOCUMENTS
          // eslint-disable-next-line unicorn/no-null
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
      // projects only the total sum
      {
        $project: {
          total: 1,
        },
      },
      // SUMS THE AMOUNT OF THE NEW TRANSACTION TO THE DAILY QUOTA
    ]).then((result) => (result[0]?.total || 0) + amount);

    console.log({ dailyQuota });

    if (dailyQuota > MAX_DAILY_QUOTA) {
      throw new AccountDailyQuotaExceededError(
        LL.ACCOUNT.ERROR.DAILY_QUOTA_EXCEEDED(),
      );
    }
  }),
  createTransaction,
]);

router.route("/account/:accountId").get([
  query(
    "type",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_OPTIONAL_TYPE_PARAM()),
  )
    .optional()
    .isIn([WITHDRAWAL, DEPOSIT]),
  query(
    "currency",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_OPTIONAL_CURRENCY_PARAM()),
  )
    .optional()
    .isMongoId(),
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()))
    .toInt(),
  query("page")
    .optional()
    .isInt({ min: 0 })
    .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE()))
    .toInt(),
  param(
    "accountId",
    message((LL) => LL.TRANSACTION.ROUTES.INVALID_ACCOUNT_ID()),
  ).isMongoId(),
  validateChecks,
  custom(async (req, LL) => {
    const { accountId } = req.params;
    // check if account exists
    const accountFound = await Account.findOne({
      _id: accountId,
      tp_status: ACTIVE,
    });

    if (!accountFound) {
      throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
    }
  }),
  custom(async (req, LL) => {
    const { currency } = req.query;
    // if not currency provided, skip
    if (currency === undefined || currency === null) return;

    // check if currency exists
    const currencyFound = await Currency.findOne({
      _id: currency,
      tp_status: ACTIVE,
    });

    if (!currencyFound) {
      throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
    }
  }),
  getAllTransactionsByAccount,
]);

router.route("/user/:userId").get(
  [
    query(
      "type",
      message((LL) => LL.TRANSACTION.ROUTES.INVALID_OPTIONAL_TYPE_PARAM()),
    )
      .optional()
      .isIn([WITHDRAWAL, DEPOSIT]),
    query(
      "currency",
      message((LL) => LL.TRANSACTION.ROUTES.INVALID_OPTIONAL_CURRENCY_PARAM()),
    )
      .optional()
      .isMongoId(),
    query("limit")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()))
      .toInt(),
    query("page")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE()))
      .toInt(),
    param(
      "userId",
      message((LL) => LL.TRANSACTION.ROUTES.INVALID_USER_ID()),
    ).isMongoId(),
    validateChecks,

    custom(async (req, LL) => {
      const { userId } = req.params;
      // check if account exists
      const userFound = await User.findOne({
        _id: userId,
        tp_status: ACTIVE,
      });

      if (!userFound) {
        throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }
    }),
    custom(async (req, LL) => {
      const { currency } = req.query;
      // if not currency provided, skip
      if (currency === undefined || currency === null) return;

      // check if currency exists
      const currencyFound = await Currency.findOne({
        _id: currency,
        tp_status: ACTIVE,
      });

      if (!currencyFound) {
        throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
      }
    }),
  ],
  getAllTransactionsByUser,
);

export default router;
