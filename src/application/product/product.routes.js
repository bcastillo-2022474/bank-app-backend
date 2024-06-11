import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProductById,
} from "./product.controller.js";
import { ProductAlreadyExist, ProductNotFound } from "./product.error.js";
import Product, { ACTIVE } from "./product.model.js";
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
      custom(async (req, LL) => {
        const { name } = req.body;
        const product = await Product.findOne({ name, tp_status: ACTIVE });
        if (product) {
          throw new ProductAlreadyExist(LL.PRODUCT.ERROR.NAME_ALREADY_EXISTS());
        }
      }),
      body(
        "description",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_DESCRIPTION()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "price",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_NAME()),
      ).isNumeric(),
      body(
        "currency",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_CURRENCY()),
      ).isMongoId(),
      body(
        "stock",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_STOCK()),
      ).isNumeric(),
    ],
    createProduct,
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
      custom(async (req, LL) => {
        const { name } = req.body;
        if (name === undefined || name === null) return;

        const product = await Product.findOne({
          _id: { $ne: req.params.id },
          name,
          tp_status: ACTIVE,
        });
        if (product) {
          throw new ProductAlreadyExist(LL.PRODUCT.ERROR.NAME_ALREADY_EXISTS());
        }
      }),
      body(
        "description",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_OPTIONAL_DESCRIPTION()),
      )
        .optional()
        .isString()
        .isLength({ min: 20, max: 255 }),
      body(
        "price",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_NAME()),
      )
        .optional()
        .isNumeric(),
      body(
        "currency",
        message((LL) => LL.ACCOUNT.ROUTES.INVALID_OPTIONAL_CURRENCY()),
      )
        .optional()
        .isMongoId(),
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
      body(
        "stock",
        message((LL) => LL.PRODUCT.ROUTES.INVALID_STOCK()),
      )
        .optional()
        .isNumeric(),
      custom(async (req, LL) => {
        const { stock } = req.body;
        if (stock === undefined || stock === null) return;

        const product = await Product.findOne({
          _id: { $ne: req.params.id },
          stock,
          tp_status: ACTIVE,
        });
        if (product) {
          throw new ProductAlreadyExist(
            LL.PRODUCT.ERROR.STOCK_ALREADY_EXISTS(),
          );
        }
      }),
    ],
    updateProduct,
  )
  .delete(
    [
      retrieveLocale,
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
          throw new ProductAlreadyExist(LL.PRODUCT.ERROR.NOT_FOUND());
        }
      }),
    ],
    deleteProductById,
  );

export default router;
