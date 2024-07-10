import { Router } from "express";
import { body, param, query } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createAccount,
  getAllAccounts,
  deleteAccountById,
  updateAccountCurrency,
  getAccountsAscendant,
  getAccountsDescendant,
  getAccountsAscendantUsage,
  getAccountsDescendantUsage,
} from "./account.controller.js";
import Account, { ACTIVE } from "./account.model.js";
import { AccountNotFound } from "./account.error.js";
import { custom } from "../../middleware/custom.js";
import User from "../user/user.model.js";
import { UserNotFound } from "../user/user.error.js";
import Currency from "../currency/currency.model.js";
import { CurrencyNotFound } from "../currency/currency.error.js";

const router = Router();

router.route("/ascendant").get(
  [
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
    validateChecks,
  ],
  getAccountsAscendant,
);

router.route("/descendant").get(
  [
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
    validateChecks,
  ],
  getAccountsDescendant,
);

router.route("/ascendant-usage").get(
  [
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
    validateChecks,
  ],
  getAccountsAscendantUsage,
);

router.route("/descendant-usage").get(
  [
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
    validateChecks,
  ],
  getAccountsDescendantUsage,
);

router
  .route("/")
  .get(
    [
      query("limit")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
          message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()),
        )
        .toInt(),
      query("page")
        .optional()
        .isInt({ min: 0 })
        .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE()))
        .toInt(),
      validateChecks,
    ],
    getAllAccounts,
  )
  .post(
    [
      body(
        "owner",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_OWNER()),
      ).isMongoId(),
      body(
        "currency",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_CURRENCY()),
      ).isMongoId(),
      body(
        "balance",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_BALANCE()),
      ).isFloat({ min: 0 }),
      validateChecks,
      custom(async (req, LL) => {
        const { owner } = req.body;
        // Check if the owner exist
        const user = await User.findOne({
          _id: owner,
          tp_status: ACTIVE,
        });
        if (!user) {
          throw new UserNotFound(LL.USER.ERROR.NOT_FOUND());
        }
      }),
      custom(async (req, LL) => {
        const { currency } = req.body;
        // Check if the currency exist
        const currencyFound = await Currency.findOne({
          _id: currency,
          tp_status: ACTIVE,
        });
        if (!currencyFound) {
          throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
        }
      }),
    ],
    createAccount,
  );

router
  .route("/:id")
  .put(
    [
      param("id").isMongoId(),
      body(
        "currency",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_OPTIONAL_CURRENCY()),
      )
        .optional()
        .isMongoId(),
      validateChecks,
      custom(async (req, LL) => {
        const account = await Account.findOne({
          _id: req.params.id,
          tp_status: ACTIVE,
        });
        if (!account) {
          throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
        }
      }),
      custom(async (req, LL) => {
        const { currency } = req.body;
        // if currency not provided, skip
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
    updateAccountCurrency,
  )
  .delete(
    [
      param(
        "id",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_ACCOUNT_ID()),
      ).isMongoId(),
      validateChecks,
      custom(async (req, LL) => {
        const account = await Account.findOne({
          _id: req.params.id,
          tp_status: ACTIVE,
        });
        if (!account) {
          throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
        }
      }),
    ],
    deleteAccountById,
  );

export default router;
