import { Router } from "express";
import { body, param, query } from "express-validator";
import { message } from "../../utils/message.js";

import Transference, { ACTIVE } from "./transference.model.js";
import Account from "../account/account.model.js";
import Currency from "../currency/currency.model.js";
import User from "../user/user.model.js";

import { TransferenceNotFound } from "./transference.error.js";
import { AccountNotFound } from "../account/account.error.js";
import { CurrencyNotFound } from "../currency/currency.error.js";
import { UserNotFound } from "../user/user.error.js";
import { validateJwt } from "../../middleware/validate-jwt.js";
import {
  createTransference,
  cancelTransference,
  getAllTransferencesByAccount,
  getAllTransferencesByUser,
} from "./transference.controller.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import { custom } from "../../middleware/custom.js";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";

const router = Router();

router.route("/").post(
  [
    body("account_given")
      .isMongoId()
      .withMessage(
        message((LL) => LL.TRANSFERENCE.ROUTES.INVALID_ACCOUNT_GIVEN_ID()),
      ),
    body("account_reciver")
      .isMongoId()
      .withMessage(
        message((LL) => LL.TRANSFERENCE.ROUTES.INVALID_ACCOUNT_RECIVER_ID()),
      ),
    body("quantity")
      .isNumeric()
      .withMessage(message((LL) => LL.TRANSFERENCE.ROUTES.INVALID_QUATITY())),
    body("currency")
      .isMongoId()
      .withMessage(
        message((LL) => LL.TRANSFERENCE.ROUTES.INVALID_CURRENCY_ID()),
      ),
    validateChecks,
    custom(async (req, LL) => {
      const { account_given } = req.body;
      const account = await Account.findOne({
        _id: account_given,
        tp_status: ACTIVE,
      });

      if (!account) {
        throw new CurrencyNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }
    }),
    custom(async (req, LL) => {
      const { account_reciver } = req.body;

      const account = await Account.findOne({
        _id: account_reciver,
        tp_status: ACTIVE,
      });
      if (!account) {
        throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }
    }),
    custom(async (req, LL) => {
      const { currency } = req.body;

      const currencyFound = await Currency.findOne({
        _id: currency,
        tp_status: ACTIVE,
      });
      if (!currencyFound) {
        throw new CurrencyNotFound(LL.CURRENCY.ERROR.CURRENCY_NOT_FOUND());
      }
    }),
  ],
  createTransference,
);

// TODAS LAS TRANSFERENCIAS DE ESA CUENTA
router.route("/account/:accountId").get(
  [
    param(
      "accountId",
      message((LL) => LL.ACCOUNT.ROUTES.INVALID_ACCOUNT_ID()),
    ).isMongoId(),
    validateChecks,
    query(
      "currency",
      message((LL) => LL.TRANSACTION.ROUTES.INVALID_OPTIONAL_CURRENCY_PARAM()),
    )
      .optional()
      .isMongoId(),
    custom(async (req, LL) => {
      const { accountId } = req.params;
      const account = await Account.findOne({
        _id: accountId,
        tp_status: ACTIVE,
      });

      if (!account) {
        throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }
    }),
    custom(async (req, LL) => {
      const { currency } = req.query;
      if (currency === undefined || currency === null) return;

      const currencyFound = await Currency.findOne({
        _id: currency,
        tp_status: ACTIVE,
      });

      if (!currencyFound) {
        throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
      }
    }),
  ],
  getAllTransferencesByAccount,
);

// TODAS LAS TRANSFERENCIAS DE ESE USUARIO
router.route("/user/:userId").get(
  [
    validateJwt,
    param(
      "userId",
      message((LL) => LL.USER.ROUTES.INVALID_USER_ID()),
    ).isMongoId(),
    query(
      "currency",
      message((LL) => LL.TRANSACTION.ROUTES.INVALID_OPTIONAL_CURRENCY_PARAM()),
    ).optional(),
    validateChecks,
    custom(async (req, LL) => {
      const { userId } = req.params;
      const user = await User.findOne({
        _id: userId,
        tp_status: ACTIVE,
      });

      if (!user) {
        throw new UserNotFound(LL.USER.ERROR.NOT_FOUND());
      }
    }),
    custom(async (req, LL) => {
      const { currency } = req.query;
      if (currency === undefined || currency === null) return;

      const currencyFound = await Currency.findOne({
        _id: currency,
        tp_status: ACTIVE,
      });

      if (!currencyFound) {
        throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
      }
    }),
  ],
  getAllTransferencesByUser,
);

router.route("/:transferenceId").delete(
  [
    retrieveLocale,
    param("transferenceId")
      .isMongoId()
      .withMessage(
        message((LL) => LL.TRANSFERENCE.ROUTES.INVALID_TRANSFERENCE_ID()),
      ),
    validateChecks,
    custom(async (req, LL) => {
      const { transferenceId } = req.params;
      const transference = await Transference.findOne({
        _id: transferenceId,
        tp_status: ACTIVE,
      });

      if (!transference) {
        throw new TransferenceNotFound(LL.TRANSFERENCE.ERROR.NOT_FOUND());
      }
    }),
  ],
  cancelTransference,
);

export default router;
