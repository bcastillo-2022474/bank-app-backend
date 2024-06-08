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
import { CurrencyAlreadyExist, CurrencyNotFound } from "./currency.error.js";
import Currency, { ACTIVE } from "./currency.model.js";
import { custom } from "../../middleware/custom.js";

const router = Router();

router
  .route("/")
  .get(
    [
      retrieveLocale,
      query("limit")
        .optional()
        .isInt({ min: 0 })
        .withMessage(
          message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()),
        ) // If last check fails, this message will be shown
        .toInt(), // // converts the value to an integer
      query("page")
        .optional()
        .isInt({ min: 0 })
        .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE())) // If last check fails, this message will be shown
        .toInt(), // Converts the value to an integer
      validateChecks,
    ],
    getAllCurrencies,
  )
  .post(
    [
      body(
        "symbol",
        message((LL) => LL.CURRENCY.ROUTES.INVALID_SYMBOL()),
      )
        .isString()
        .isLength({ max: 3 }),

      body(
        "name",
        message((LL) => LL.CURRENCY.ROUTES.INVALID_NAME()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "key",
        message((LL) => LL.CURRENCY.ROUTES.INVALID_KEY()),
      )
        .isString()
        .isLength({ max: 3 }),
      validateChecks,
      custom(async (req, LL) => {
        const { symbol } = req.body;
        // Check if the symbol already exists in the database
        const currency = await Currency.findOne({
          symbol,
          tp_status: ACTIVE,
        });
        if (currency) {
          throw new CurrencyAlreadyExist(
            LL.CURRENCY.ERROR.SYMBOL_ALREADY_EXISTS(),
          );
        }
      }),
      custom(async (req, LL) => {
        const { name } = req.body;
        // Check if the name already exists in the database
        const currency = await Currency.findOne({ name, tp_status: ACTIVE });
        if (currency) {
          throw new CurrencyAlreadyExist(
            LL.CURRENCY.ERROR.NAME_ALREADY_EXISTS(),
          );
        }
      }),
      custom(async (req, LL) => {
        const { key } = req.body;
        // Check if the key already exists in the database
        const currency = await Currency.findOne({ key, tp_status: ACTIVE });
        if (currency) {
          throw new CurrencyAlreadyExist(
            LL.CURRENCY.ERROR.KEY_ALREADY_EXISTS(),
          );
        }
      }),
    ],
    createCurrency,
  );

router
  .route("/:id")
  .put(
    [
      retrieveLocale,
      param("id").isMongoId(),
      body("symbol").optional().isString().isLength({ max: 3 }),
      body(
        "name",
        message((LL) => LL.CURRENCY.ROUTES.INVALID_OPTIONAL_NAME()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "key",
        message((LL) => LL.CURRENCY.ROUTES.INVALID_OPTIONAL_KEY()),
      )
        .optional()
        .isString()
        .isLength({ max: 3 }),
      validateChecks,
      custom(async (req, LL) => {
        const { symbol } = req.body;
        // Check if the symbol already exists in another currency except itself
        const currency = await Currency.findOne({
          _id: { $ne: req.params.id },
          symbol,
          tp_status: ACTIVE,
        });
        if (currency) {
          throw new CurrencyAlreadyExist(
            LL.CURRENCY.ERROR.SYMBOL_ALREADY_EXISTS(),
          );
        }
      }),
      custom(async (req, LL) => {
        const { name } = req.body;
        // Check if the name already exists in another currency except itself
        const currency = await Currency.findOne({
          _id: { $ne: req.params.id },
          name,
          tp_status: ACTIVE,
        });
        if (currency) {
          throw new CurrencyAlreadyExist(
            LL.CURRENCY.ERROR.NAME_ALREADY_EXISTS(),
          );
        }
      }),
      custom(async (req, LL) => {
        const { key } = req.body;
        // Check if the key already exists in another currency except itself
        const currency = await Currency.findOne({
          _id: { $ne: req.params.id },
          key,
          tp_status: ACTIVE,
        });
        if (currency) {
          throw new CurrencyAlreadyExist(
            LL.CURRENCY.ERROR.KEY_ALREADY_EXISTS(),
          );
        }
      }),
    ],
    updateCurrency,
  )
  .delete(
    [
      retrieveLocale,
      param("id")
        .isMongoId()
        .withMessage(message((LL) => LL.CURRENCY.ROUTES.INVALID_CURRENCY_ID())),
      validateChecks,
      custom(async (req, LL) => {
        const { id } = req.params;
        const currency = await Currency.findOne({
          _id: id,
          tp_status: ACTIVE,
        });

        if (!currency) {
          throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
        }
      }),
    ],
    deleteCurrencyById,
  );

export default router;
