import { Router } from "express";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProductById,
  addStockToProduct,
} from "./product.controller.js";
import { ProductNotFound } from "./product.error.js";
import Product, { ACTIVE } from "./product.model.js";
import Currency from "../currency/currency.model.js";
import { custom } from "../../middleware/custom.js";
import { CurrencyNotFound } from "../currency/currency.error.js";

const router = Router();

router
  .route("/")
  .get(
    [
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
    getAllProducts,
  )
  .post(
    [
      body(
        "name",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_NAME()),
      )
        .isString()
        .isLength({ min: 3, max: 40 }),
      body(
        "description",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_DESCRIPTION()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "price",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_NAME()),
      ).isFloat({ min: 0 }),
      body(
        "currency",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_CURRENCY()),
      ).isMongoId(),
      body(
        "stock",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_STOCK()),
      ).isInt({ min: 0 }),
      validateChecks,
      custom(async (req, LL) => {
        const { currency } = req.body;
        const currencyFound = await Currency.findOne({
          _id: currency,
          tp_status: ACTIVE,
        });
        if (!currencyFound) {
          throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
        }
      }),
    ],
    createProduct,
  );

router.route("/addStock").post(
  [
    body(
      "id",
      message((LL) => LL.PRODUCT.ROUTES.INVALID_PRODUCT_ID()),
    ).isMongoId(),
    body(
      "stock",
      message((LL) => LL.PRODUCT.ROUTES.INVALID_STOCK()),
    ).isInt({ min: 0 }),
    validateChecks,
    custom(async (req, LL) => {
      const { product } = req.body;
      const productFound = await Product.findOne({
        _id: product,
        tp_status: ACTIVE,
      });
      if (!productFound) {
        throw new CurrencyNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
      }
    }),
  ],
  addStockToProduct,
);

router
  .route("/:id")
  .put(
    [
      param("id").isMongoId(),
      body(
        "name",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_OPTIONAL_NAME()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 40 }),
      body(
        "description",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_OPTIONAL_DESCRIPTION()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "price",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_NAME()),
      )
        .optional()
        .isFloat({ min: 0 }),
      body(
        "currency",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_OPTIONAL_CURRENCY()),
      )
        .optional()
        .isMongoId(),
      body(
        "stock",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_STOCK()),
      )
        .optional()
        .isInt({ min: 0 }),
      validateChecks,
      custom(async (req, LL) => {
        const product = await Product.findOne({
          _id: req.params.id,
          tp_status: ACTIVE,
        });
        if (!product) {
          throw new ProductNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
        }
      }),
      custom(async (req, LL) => {
        const { currency } = req.body;
        if (currency === undefined || currency === null) return;

        const currencyFound = await Currency.findOne({
          _id: currency,
          tp_status: ACTIVE,
        });
        if (!currencyFound) {
          throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
        }
      }),
    ],
    updateProduct,
  )
  .delete(
    [
      param("id")
        .isMongoId()
        .withMessage(message((LL) => LL.PRODUCT.ROUTES.INVALID_PRODUCT_ID())),
      validateChecks,
      custom(async (req, LL) => {
        const { id } = req.params;
        const product = await Product.findOne({
          _id: id,
          tp_status: ACTIVE,
        });

        if (!product) {
          throw new ProductNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
        }
      }),
    ],
    deleteProductById,
  );

export default router;
