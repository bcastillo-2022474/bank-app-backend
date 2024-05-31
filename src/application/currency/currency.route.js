import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createCurrency,
  getAllCurrencies,
  // deleteCurrencyById,
} from "./currency.controller.js";
import { CurrencyAlreadyExist } from "./currency.error.js";
import Currency, { ACTIVE } from "./currency.model.js";
const router = Router();

router
  .route("/")
  .get(
    [
      retrieveLocale,
      query("limit")
        .optional()
        .isInt({ min: 0 })
        .withMessage(message((LL) => LL.INVALID_OPTIONAL_LIMIT())) // If last check fails, this message will be shown
        .toInt(), // // converts the value to an integer
      query("page")
        .optional()
        .isInt({ min: 0 })
        .withMessage(message((LL) => LL.INVALID_OPTIONAL_PAGE())) // If last check fails, this message will be shown
        .toInt(), // Converts the value to an integer
      validateChecks,
    ],
    getAllCurrencies,
  )
  .post(
    [
      retrieveLocale,
      body("symbol")
        .isString()
        .isLength({ max: 3 })
        .withMessage(message((LL) => LL.INVALID_CURRENCY_SYMBOL())) // If last check fails, this message will be shown
        .custom((symbol) => {
          // Check if the symbol already exists in the database
          const currency = Currency.findOne({ symbol, tp_status: ACTIVE });
          if (!currency) {
            throw new CurrencyAlreadyExist("Symbol already exists");
          }
        }),
      body("name")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.IINVALID_CURRENCY_NAME())),
      validateChecks,
    ],
    createCurrency,
  );

export default router;
