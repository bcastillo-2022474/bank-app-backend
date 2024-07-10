import { Router } from "express";
import { body, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import { custom } from "../../middleware/custom.js";
import { ProductNotFound } from "../product/product.error.js";
import { ACTIVE } from "../user/user.model.js";
import { AccountNotFound } from "../account/account.error.js";
import { createPurchase, deletePurchaseById } from "./purchase.controller.js";
import Product from "../product/product.model.js";
import Account from "../account/account.model.js";
import { PurchaseNotFound } from "./purchase.errors.js";
import Purchase from "./purchase.model.js";

const router = Router();

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
