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
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_SYMBOL()))
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
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_NAME()))
        .custom(async (name, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({ name, tp_status: ACTIVE });
          if (account) {
            throw new AccountAlreadyExist(
              LL.CURRENCY.ERROR.NAME_ALREADY_EXISTS(),
            );
          }
          return true;
        }),
        
      body("balance")
        .isNumber()
        .isLength({ min: 2 })
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_KEY()))
        .custom(async (key, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({ key, tp_status: ACTIVE });
          if (account) {
            throw new AccountAlreadyExist(
              LL.ACCOUNT.ERROR.KEY_ALREADY_EXISTS(),
            );
          }
          return true;
        }),
      validateChecks,
    ],
    createAccount,
  );

router.route("/:id")
  .put(
    [
      retrieveLocale,
      param("id").isMongoId(),
      body("owner")
        .optional()
        .isMongoId()
        .isLength({ min: 3 })
        .custom(async (owner, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({
            _id: { $ne: req.params.id },
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
      body("balance")
        .optional()
        .isNumber()
        .withMessage(message((LL) => LL.ACCOUNT.ROUTES.INVALID_OPTIONAL_BALANCE()))
        .custom(async (balance, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          const account = await Account.findOne({
            _id: { $ne: req.params.id },
            balance,
            tp_status: ACTIVE,
          });
          if (account) {
            throw new AccountAlreadyExist(
              LL.ACCOUNT.ERROR.BALANCE_ALREADY_EXISTS(),
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