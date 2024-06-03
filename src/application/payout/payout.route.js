import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createPayout,
  getAllPayout,
  deletePayoutById,
  updatePayout,
} from "./payout.controller.js";
import { PayoutAlreadyExist } from "./payout.error.js";
import Payout, { ACTIVE } from "./payout.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";

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
    getAllPayout,
  )
  .post(
    [
      body("symbol")
        .isString()
        .isLength({ max: 3 })
        .withMessage(message((LL) => LL.CURRENCY.ROUTES.INVALID_SYMBOL()))
        .custom(async (symbol, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the symbol already exists in the database
          const currency = await Payout.findOne({
            symbol,
            tp_status: ACTIVE,
          });
          if (currency) {
            throw new PayoutAlreadyExist(
              LL.CURRENCY.ERROR.SYMBOL_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }), // If last check fails, this message will be shown

      body("name")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.CURRENCY.ROUTES.INVALID_NAME()))
        .custom(async (name, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the name already exists in the database
          const currency = await Payout.findOne({ name, tp_status: ACTIVE });
          if (currency) {
            throw new PayoutAlreadyExist(
              LL.CURRENCY.ERROR.NAME_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      body("key")
        .isString()
        .isLength({ max: 3 })
        .withMessage(message((LL) => LL.CURRENCY.ROUTES.INVALID_KEY())) // If last check fails, this message will be shown
        .custom(async (key, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the key already exists in the database
          const currency = await Payout.findOne({ key, tp_status: ACTIVE });
          if (currency) {
            throw new PayoutAlreadyExist(
              LL.CURRENCY.ERROR.KEY_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      validateChecks,
    ],
    createPayout,
  );

router
  .route("/:id")
  .put(
    [
      retrieveLocale,
      param("id").isMongoId(),
      body("symbol")
        .optional()
        .isString()
        .isLength({ max: 3 })
        .custom(async (symbol, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the symbol already exists in another currency except itself
          const currency = await Payout.findOne({
            _id: { $ne: req.params.id },
            symbol,
            tp_status: ACTIVE,
          });
          if (currency) {
            throw new PayoutAlreadyExist(
              LL.CURRENCY.ERROR.SYMBOL_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      body("name")
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(
          message((LL) => LL.CURRENCY.ROUTES.INVALID_OPTIONAL_NAME()),
        )
        .custom(async (name, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the name already exists in another currency except itself
          const currency = await Payout.findOne({
            _id: { $ne: req.params.id },
            name,
            tp_status: ACTIVE,
          });
          if (currency) {
            throw new PayoutAlreadyExist(
              LL.CURRENCY.ERROR.NAME_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      body("key")
        .optional()
        .isString()
        .isLength({ max: 3 })
        .withMessage(message((LL) => LL.CURRENCY.ROUTES.INVALID_OPTIONAL_KEY()))
        .custom(async (key, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the key already exists in another currency except itself
          const currency = await Payout.findOne({
            _id: { $ne: req.params.id },
            key,
            tp_status: ACTIVE,
          });
          if (currency) {
            throw new PayoutAlreadyExist(
              LL.CURRENCY.ERROR.KEY_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      validateChecks,
    ],
    updatePayout,
  )
  .delete(
    [
      retrieveLocale,
      param("id")
        .isMongoId()
        .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_MONGO_ID())),
      validateChecks,
    ],
    deletePayoutById,
  );

export default router;
