import { Router } from "express";
import { body, param, query } from "express-validator";
import { DEPOSIT, WITHDRAWAL } from "./transaction.model.js";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import { custom } from "../../middleware/custom.js";
import { AccountNotFound } from "../account/account.error.js";
import Account, { ACTIVE } from "../account/account.model.js";
import Currency from "../currency/currency.model.js";
import { CurrencyNotFound } from "../currency/currency.error.js";
import User from "../user/user.model.js";
import {
  createTransaction,
  getAllTransactionsByAccount,
  getAllTransactionsByUser,
} from "./transaction.controller.js";

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
  ),
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
    ),
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
  ],
  getAllTransactionsByUser,
);

export default router;
