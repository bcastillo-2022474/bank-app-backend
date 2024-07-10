import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import { custom } from "../../middleware/custom.js";
import { ProductNotFound } from "../product/product.error.js";
import { ACTIVE } from "../user/user.model.js";
import { AccountNotFound } from "../account/account.error.js";
import {
  createPurchase,
  deletePurchaseById,
  getAllPurcahse,
  getPurchaseByAccount,
  getPurchaseByProduct,
  getPurchaseById,
  getPurchaseByUserId,
} from "./purchase.controller.js";
import Product from "../product/product.model.js";
import Account from "../account/account.model.js";
import { PurchaseNotFound } from "./purchase.errors.js";
import Purchase from "./purchase.model.js";

const router = Router();

router.route("/").get(
  [
    retrieveLocale,
    query("limit")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()))
      .toInt(),
    query("page")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE()))
      .toInt(),
    validateChecks,
  ],
  getAllPurcahse,
);

router.route("/account/:accountId").get(
  [
    param(
      "accountId",
      message((LL) => LL.PURCHASE.ROUTES.INVALID_ACCOUNT_ID()),
    ).isMongoId(),
    query("limit")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()))
      .toInt(),
    query("page")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE()))
      .toInt(),
    validateChecks,
  ],
  getPurchaseByAccount,
);

router.route("/product/:productId").get(
  [
    param(
      "productId",
      message((LL) => LL.PURCHASE.ROUTES.INVALID_PRODUCT_ID()),
    ).isMongoId(),
    query("limit")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT()))
      .toInt(),
    query("page")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE()))
      .toInt(),
    validateChecks,
  ],
  getPurchaseByProduct,
);

router.route("/user/:userId").get([
  param(
    "userId",
    message((LL) => LL.PURCHASE.ROUTES.INVALID_USER_ID()),
  ).isMongoId(),
  validateChecks,
  getPurchaseByUserId,
]);

router.route("/:id").get(
  [
    param(
      "id",
      message((LL) => LL.PURCHASE.ROUTES.INVALID_PURCHASE_ID()),
    ).isMongoId(),
    validateChecks,
    custom(async (req, LL) => {
      const { id } = req.params;
      // Check if the purchase exists in the database
      const purchaseFound = await Purchase.findOne({
        _id: id,
        tp_status: ACTIVE,
      });
      if (!purchaseFound) {
        throw new PurchaseNotFound(LL.PURCHASE.ERROR.NOT_FOUND());
      }
    }),
  ],
  getPurchaseById,
);

router.route("/").post(
  [
    body(
      "product",
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
      const { product } = req.body;
      // Check if the service already exists in the database
      const productFound = await Product.findOne({
        _id: product,
        tp_status: ACTIVE,
      });
      if (!productFound) {
        throw new ProductNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
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
  createPurchase,
);

router.route("/:id").delete(
  [
    param(
      "id",
      message((LL) => LL.PAYOUT.ROUTES.INVALID_PAYOUT_ID()),
    ).isMongoId(),
    validateChecks,
    custom(async (req, LL) => {
      const { id } = req.params;
      // Check if the payout exists in the database
      const purchaseFound = await Purchase.findOne({
        _id: id,
        tp_status: ACTIVE,
      });
      if (!purchaseFound) {
        throw new PurchaseNotFound(LL.PAYOUT.ERROR.NOT_FOUND());
      }
    }),
  ],
  deletePurchaseById,
);

export default router;
