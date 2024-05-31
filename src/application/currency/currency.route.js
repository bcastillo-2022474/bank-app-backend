import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createCurrency,
  getAllCurrencies,
  deleteCurrencyById,
  updateCurrency,
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
      body("symbol")
        .isString()
        .isLength({ max: 3 })
        .withMessage(message((LL) => LL.INVALID_CURRENCY_SYMBOL())), // If last check fails, this message will be shown

      body("name")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.IINVALID_CURRENCY_NAME())),
      body("key")
        .isString()
        .isLength({ max: 3 })
        .withMessage(message((LL) => LL.INVALID_CURRENCY_KEY())), // If last check fails, this message will be shown

      validateChecks,
    ],
    createCurrency,
  );

router.put(
  "/:id",
  [
    retrieveLocale,
    param("id").isMongoId(),
    body("symbol")
      .optional()
      .isString()
      .isLength({ max: 3 })
      .custom((symbol) => {
        // Check if the symbol already exists in the database
        const currency = Currency.findOne({ symbol, tp_status: ACTIVE });
        if (!currency) {
          throw new CurrencyAlreadyExist("Symbol already exists");
        }
      }),
    body("name")
      .optional()
      .isString()
      .isLength({ min: 3, max: 255 })
      .withMessage(message((LL) => LL.IINVALID_CURRENCY_NAME())),
    body("key")
      .optional()
      .isString()
      .isLength({ max: 3 })
      .withMessage(message((LL) => LL.INVALID_CURRENCY_KEY()))
      .custom((key) => {
        const currency = Currency.findOne({ key, tp_status: ACTIVE });
        if (!currency) {
          throw new CurrencyAlreadyExist("key already exists");
        }
      }),
    validateChecks,
  ],
  updateCurrency,
);

router
  .route("/:id")
  .put([
    retrieveLocale,
    body("symbol")
      .optional()
      .isString()
      .isLength({ max: 3 })
      .withMessage(message((LL) => LL.INVALID_OPTIONAL_SYMBOL())), // If last check fails, this message will be shown
    body("name")
      .optional()
      .isString()
      .isLength({ min: 3, max: 255 })
      .withMessage(message((LL) => LL.INVALID_OPTIONAL_NAME())),
    validateChecks,
    retrieveLocale,
    body("symbol")
      .optional()
      .isString()
      .isLength({ max: 3 })
      .withMessage(message((LL) => LL.INVALID_OPTIONAL_KEY())),
  ])
  .delete(
    [
      retrieveLocale,
      param("id")
        .isMongoId()
        .withMessage(message((LL) => LL.INVALID_MONGO_ID())),
      validateChecks,
    ],
    deleteCurrencyById,
  );

export default router;
