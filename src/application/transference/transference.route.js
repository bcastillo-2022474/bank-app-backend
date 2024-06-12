import { Router } from "express";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import Account from "../account/account.model.js";
import Currency from "../currency/currency.model.js";
import { AccountNotFound } from "../account/account.error.js";
import { CurrencyNotFound } from "../currency/currency.error.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";

const router = Router();

router.route("/").post([
  // ------------------------ VALIDAR JWT ------------------------- //
  body("account_given")
    .isMongoId()
    .withMessage(message((LL) => LL.TRANSFERENCE.ROUTES.WHATEVER()))
    .custom(async (accountId, { req }) => {
      const LL = getTranslationFunctions(req.locale);
      const account = await Account.findById(accountId);
      if (!account) {
        throw new CurrencyNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }

      return true;
    }),
  body("account_reciver")
    .isMongoId()
    .withMessage(message((LL) => LL.TRANSFERENCE.ROUTES.WHATEVER()))

    .custom(async (accountId, { req }) => {
      const LL = getTranslationFunctions(req.locale);
      const account = await Account.findById(accountId);
      if (!account) {
        throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }

      return true;
    }),
  body("quantity")
    .isNumeric()
    .withMessage(message((LL) => LL.TRANSFERENCE.ROUTES.WHATEVER())),
  body("currency")
    .isMongoId()
    .withMessage(message((LL) => LL.TRANSFERENCE.ROUTES.WHATEVER()))
    .custom(async (currencyId, { req }) => {
      const LL = getTranslationFunctions(req.locale);
      const currency = await Currency.findById(currencyId);
      if (!currency) {
        throw new AccountNotFound(LL.CURRENCY.ERROR.CURRENCY_NOT_FOUND());
      }

      return true;
    }),
  // ------------------------ AQUI IRIA EL METODO ------------------------- //
]);

// TODAS LAS TRANSFERENCIAS DE ESA CUENTA
router.route("/account/:accountId").get([]);

// TODAS LAS TRANSFERENCIAS DE ESE USUARIO
router.route("/user/:userId").get([]);

export default router;
