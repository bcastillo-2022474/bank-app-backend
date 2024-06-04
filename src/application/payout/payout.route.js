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
import Service from "../service/service.model.js";
import { ServiceNotFound } from "../service/service.error.js";
import { AccountNotFound } from "../account/account.error.js";
import Account from "../account/account.model.js";

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
      body("service")
        .isMongoId()
        .withMessage(message((LL) => LL.PAYOUT.ROUTES.INVALID_SERVICE()))
        .custom(async (service, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the service already exists in the database
          const serviceFound = await Service.findOne({
            _id: service,
            tp_status: ACTIVE,
          });
          if (!serviceFound) {
            throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }), // If last check fails, this message will be shown

      body("total")
        .isNumeric()
        .withMessage(message((LL) => LL.PAYOUT.ROUTES.INVALID_TOTAL())),
      body("debited_account")
        .isMongoId()
        .withMessage(
          message((LL) => LL.PAYOUT.ROUTES.INVALID_DEBITED_ACCOUNT()),
        ) // If last check fails, this message will be shown
        .custom(async (debited_account, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the debited_account already exists in the database
          const accountFound = await Account.findOne({
            _id: debited_account,
            tp_status: ACTIVE,
          });
          if (!accountFound) {
            throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
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
      body("service")
        .optional()
        .isMongoId()
        .custom(async (service, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the service already exists in another payout except itself
          const payout = await Payout.findOne({
            _id: { $ne: req.params.id },
            service,
            tp_status: ACTIVE,
          });
          if (payout) {
            throw new PayoutAlreadyExist(
              LL.PAYOUT.ERROR.SERVICE_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      body("total")
        .optional()
        .isMongoId()
        .withMessage(message((LL) => LL.PAYOUT.ROUTES.INVALID_OPTIONAL_TOTAL()))
        .custom(async (total, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the total already exists in another payout except itself
          const payout = await Payout.findOne({
            _id: { $ne: req.params.id },
            total,
            tp_status: ACTIVE,
          });
          if (payout) {
            throw new PayoutAlreadyExist(
              LL.PAYOUT.ERROR.TOTAL_ALREADY_EXISTS(),
            );
          }

          // NECESSARY TO RETURN BOOLEAN
          return true;
        }),
      body("debited_account")
        .optional()
        .isMongoId()
        .withMessage(
          message((LL) => LL.PAYOUT.ROUTES.INVALID_OPTIONAL_DEBITED_ACCOUNT()),
        )
        .custom(async (debited_account, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Check if the debited_account already exists in another payout except itself
          const payout = await Payout.findOne({
            _id: { $ne: req.params.id },
            debited_account,
            tp_status: ACTIVE,
          });
          if (payout) {
            throw new PayoutAlreadyExist(
              LL.PAYOUT.ERROR.DEBITED_ACCOUNT_ALREADY_EXISTS(),
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
