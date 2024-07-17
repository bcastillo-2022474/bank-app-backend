import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createPayout,
  getAllPayout,
  deletePayoutById,
  getAllPayoutsByAccount,
  getAllPayoutsByServiceId,
  getAllPayoutsByUserId,
} from "./payout.controller.js";
import Payout, { ACTIVE } from "./payout.model.js";
import Service from "../service/service.model.js";
import { ServiceNotFound } from "../service/service.error.js";
import { AccountNotFound } from "../account/account.error.js";
import Account from "../account/account.model.js";
import { custom } from "../../middleware/custom.js";
import { PayoutNotFound } from "./payout.error.js";

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
      body(
        "service",
        message((LL) => LL.PAYOUT.ROUTES.INVALID_SERVICE()),
      ).isMongoId(),

      body(
        "total",
        message((LL) => LL.PAYOUT.ROUTES.INVALID_TOTAL()),
      ).isFloat({
        min: 0,
      }),
      body(
        "debited_account",
        message((LL) => LL.PAYOUT.ROUTES.INVALID_DEBITED_ACCOUNT()),
      ).isMongoId(),
      validateChecks,
      custom(async (req, LL) => {
        const { service } = req.body;
        // Check if the service already exists in the database
        const serviceFound = await Service.findOne({
          _id: service,
          tp_status: ACTIVE,
        });
        if (!serviceFound) {
          throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
        }
      }),
      custom(async (req, LL) => {
        const { debited_account } = req.body;
        // Check if the debited_account already exists in the database
        const accountFound = await Account.findOne({
          _id: debited_account,
          tp_status: ACTIVE,
        });
        if (!accountFound) {
          throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
        }
      }),
    ],
    createPayout,
  );

router.route("/user/:userId").get(getAllPayoutsByUserId);

router.route("/account/:accountId").get(
  [
    param(
      "accountId",
      message((LL) => LL.PAYOUT.ROUTES.INVALID_ACCOUNT_ID()),
    ).isMongoId(),
    validateChecks,
    custom(async (req, LL) => {
      const { accountId } = req.params;
      // Check if the account exists in the database
      const accountFound = await Account.findOne({
        _id: accountId,
        tp_status: ACTIVE,
      });
      if (!accountFound) {
        throw new AccountNotFound(LL.ACCOUNT.ERROR.NOT_FOUND());
      }
    }),
  ],
  getAllPayoutsByAccount,
);

router.route("/service/:serviceId").get(
  [
    param(
      "serviceId",
      message((LL) => LL.PAYOUT.ROUTES.INVALID_SERVICE()),
    ).isMongoId(),
    validateChecks,
    custom(async (req, LL) => {
      const { serviceId } = req.params;
      // Check if the service exists in the database
      const serviceFound = await Service.findOne({
        _id: serviceId,
        tp_status: ACTIVE,
      });
      if (!serviceFound) {
        throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
      }
    }),
  ],
  getAllPayoutsByServiceId,
);

router.route("/:id").delete(
  [
    retrieveLocale,
    param(
      "id",
      message((LL) => LL.PAYOUT.ROUTES.INVALID_PAYOUT_ID()),
    ).isMongoId(),
    validateChecks,
    custom(async (req, LL) => {
      const { id } = req.params;
      // Check if the payout exists in the database
      const payoutFound = await Payout.findOne({
        _id: id,
        tp_status: ACTIVE,
      });
      if (!payoutFound) {
        throw new PayoutNotFound(LL.PAYOUT.ERROR.NOT_FOUND());
      }
    }),
  ],
  deletePayoutById,
);

export default router;
