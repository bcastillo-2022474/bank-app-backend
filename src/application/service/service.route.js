import { Router } from "express";
import { body, param, query } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  createService,
  deleteServiceById,
  getAllServices,
  getServiceById,
  updateService,
} from "./service.controller.js";
import { custom } from "../../middleware/custom.js";
import Currency, { ACTIVE } from "../currency/currency.model.js";
import { ServiceNotFound } from "./service.error.js";

const router = Router();

router
  .route("/")
  .post(
    [
      body(
        "name",
        message((LL) => LL.SERVICE.ROUTES.INVALID_NAME()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "description",
        message((LL) => LL.SERVICE.ROUTES.INVALID_DESCRIPTION()),
      )
        .isString()
        .isLength({ min: 5, max: 255 }),
      body(
        "price",
        message((LL) => LL.SERVICE.ROUTES.INVALID_PRICE()),
      ).isFloat({ min: 0 }),
      body(
        "currency",
        message((LL) => LL.SERVICE.ROUTES.INVALID_CURRENCY()),
      ).isMongoId(),
      validateChecks,
      custom(async (req, LL) => {
        const { currency } = req.body;

        const currencyFound = await Currency.findOne({
          _id: currency,
          tp_status: ACTIVE,
        });

        if (!currencyFound) {
          throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
        }
      }),
    ],
    createService,
  )
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
    getAllServices,
  );

router
  .route("/:id")
  .get(
    [
      param(
        "id",
        message((LL) => LL.SERVICE.ROUTES.INVALID_SERVICE_ID()),
      ).isMongoId(),
      validateChecks,
    ],
    getServiceById,
  )
  .put(
    [
      body(
        "name",
        message((LL) => LL.SERVICE.ROUTES.INVALID_NAME()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "description",
        message((LL) => LL.SERVICE.ROUTES.INVALID_DESCRIPTION()),
      )
        .optional()
        .isString()
        .isLength({ min: 5, max: 255 }),
      body(
        "price",
        message((LL) => LL.SERVICE.ROUTES.INVALID_PRICE()),
      )
        .optional()
        .isFloat({ min: 0 }),
      body(
        "currency",
        message((LL) => LL.SERVICE.ROUTES.INVALID_CURRENCY()),
      )
        .optional()
        .isMongoId(),
      validateChecks,
      custom(async (req, LL) => {
        const { currency } = req.body;

        if (currency === undefined || currency === null) return;

        const currencyFound = await Currency.findOne({
          _id: currency,
          tp_status: ACTIVE,
        });

        if (!currencyFound) {
          throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
        }
      }),
    ],
    updateService,
  )
  .delete(
    [
      param(
        "id",
        message((LL) => LL.SERVICE.ROUTES.INVALID_SERVICE_ID()),
      ).isMongoId(),
      validateChecks,
    ],
    deleteServiceById,
  );
export default router;
