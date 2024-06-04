import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, param, query } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createAccount,
  getAllAccounts,
  deleteAccountById,
  updateAccount,
} from "./account.controller.js";
import Account, { ACTIVE } from "./account.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { AccountAlreadyExist } from "./account.error.js";

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
      body("owner")
        .isMongoId()
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_OWNER()))
        .custom(async (owner, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({
            owner,
            tp_status: ACTIVE,
          });
          if (account) {
            throw new AccountAlreadyExist(
              LL.ACCOUNT.ERROR.OWNER_ALREADY_EXISTS(),
            );
          }

          return true;
        }),

      body("currency")
        .isMongoId()
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_CURRENCY()))
        .custom(async (name, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({ name, tp_status: ACTIVE });
          if (account) {
            throw new AccountAlreadyExist(
              LL.ACCOUNT.ERROR.CURRENCY_ALREADY_EXISTS(),
            );
          }

          return true;
        }),

      body("balance")
        .isNumeric()
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_BALANCE())),
      validateChecks,
    ],
    createAccount,
  );

router
  .route("/:id")
  .put(
    [
      retrieveLocale,
      param("id").isMongoId(),
      body("currency")
        .optional()
        .isMongoId()
        .withMessage(
          message((LL) => LL.ACCOUNT.ROUTES.INVALID_OPTIONAL_CURRENCY()),
        )
        .custom(async (currency, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({
            _id: { $ne: req.params.id },
            currency,
            tp_status: ACTIVE,
          });
          if (account) {
            throw new AccountAlreadyExist(
              LL.ACCOUNT.ERROR.CURRENCY_ALREADY_EXISTS(),
            );
          }

          return true;
        }),
      validateChecks,
    ],
    updateAccount,
  )
  .delete(
    [
      retrieveLocale,
      param("id")
        .isMongoId()
        .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_MONGO_ID())),
      validateChecks,
    ],
    deleteAccountById,
  );

export default router;
