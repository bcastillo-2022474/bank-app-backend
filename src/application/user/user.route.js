import { Router } from "express";
import {
  createUserWithAccount,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
} from "./user.controller.js";
import { body, query, param } from "express-validator";
import { validateChecks } from "../../middleware/validate-checks.js";
import User, { ACTIVE } from "./user.model.js";
import { UserAlreadyExist } from "./user.error.js";
import { message } from "../../utils/message.js";
import { custom } from "../../middleware/custom.js";
import Currency from "../currency/currency.model.js";
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
    getAllUsers,
  )
  .post(
    [
      body(
        "email",
        message((LL) => LL.USER.ROUTES.USER_EMAIL()),
      ).isEmail(),
      body(
        "username",
        message((LL) => LL.USER.ROUTES.INVALID_USERNAME()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),

      body(
        "password",
        message((LL) => LL.USER.ROUTES.INVALID_PASSWORD()),
      ).isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      }),
      body(
        "name",
        message((LL) => LL.USER.ROUTES.INVALID_NAME()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "last_name",
        message((LL) => LL.USER.ROUTES.INVALID_LAST_NAME()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "address",
        message((LL) => LL.USER.ROUTES.INVALID_ADDRESS()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "DPI",
        message((LL) => LL.USER.ROUTES.INVALID_DPI()),
      )
        .isString()
        .isLength({ min: 13, max: 13 }),
      body(
        "phone_number",
        message((LL) => LL.USER.ROUTES.INVALID_PHONE_NUMBER()),
      )
        .isString()
        .isLength({ min: 8, max: 8 }),
      body(
        "job_name",
        message((LL) => LL.USER.ROUTES.INVALID_JOB_NAME()),
      )
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "monthly_income",
        message((LL) => LL.USER.ROUTES.INVALID_MONTHLY_INCOME()),
      ).isFloat({ min: 0 }),
      body(
        "currency_income",
        message((LL) => LL.USER.ROUTES.INVALID_CURRENCY_INCOME()),
      ).isMongoId(),
      body(
        "initial_balance",
        message((LL) => LL.USER.ROUTES.INVALID_INITIAL_BALANCE()),
      ).isFloat({ min: 0 }),
      validateChecks,
      custom(async (req, LL) => {
        const { email } = req.body;

        const user = await User.findOne({ email, tp_status: ACTIVE });
        if (user) {
          throw new UserAlreadyExist(LL.USER.ERROR.EMAIL_ALREADY_EXIST());
        }
      }),
      custom(async (req, LL) => {
        const { username } = req.body;

        const user = await User.findOne({ username, tp_status: ACTIVE });
        if (user) {
          throw new UserAlreadyExist(LL.USER.ERROR.USERNAME_ALREADY_EXIST());
        }
      }),
      custom(async (req, LL) => {
        const { currency_income } = req.body;

        const currencyFound = await Currency.findOne({
          _id: currency_income,
          tp_status: ACTIVE,
        });

        if (!currencyFound) {
          throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
        }
      }),
    ],
    createUserWithAccount,
  );

router
  .route("/:id")
  .get(
    [
      param(
        "id",
        message((LL) => LL.USER.ROUTES.INVALID_USER_ID()),
      ).isMongoId(),
      validateChecks,
    ],
    getUserById,
  )
  .delete(
    [
      param(
        "id",
        message((LL) => LL.USER.ROUTES.INVALID_USER_ID()),
      ).isMongoId(),
      validateChecks,
    ],
    deleteUserById,
  )
  .put(
    [
      body(
        "username",
        message((LL) => LL.USER.ROUTES.INVALID_USERNAME()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "password",
        message((LL) => LL.USER.ROUTES.INVALID_PASSWORD()),
      )
        .optional()
        .isString()
        .isLength({ min: 6 }),
      body(
        "name",
        message((LL) => LL.USER.ROUTES.INVALID_NAME()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "address",
        message((LL) => LL.USER.ROUTES.INVALID_ADDRESS()),
      )
        .optional()
        .isString()
        .isLength({ min: 5, max: 255 }),
      body(
        "phone_number",
        message((LL) => LL.USER.ROUTES.INVALID_PHONE_NUMBER()),
      )
        .optional()
        .isString()
        .isLength({ min: 8, max: 8 }),
      body(
        "job_name",
        message((LL) => LL.USER.ROUTES.INVALID_JOB_NAME()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      body(
        "monthly_income",
        message((LL) => LL.USER.ROUTES.INVALID_MONTHLY_INCOME()),
      )
        .optional()
        .isFloat({ min: 0 }),
      body(
        "currency_income",
        message((LL) => LL.USER.ROUTES.INVALID_CURRENCY_INCOME()),
      )
        .optional()
        .isMongoId(),
      validateChecks,
      custom(async (req, LL) => {
        const { currency_income } = req.body;

        if (currency_income === undefined || currency_income === null) return;

        const currencyFound = await Currency.findOne({
          _id: currency_income,
          tp_status: ACTIVE,
        });

        if (!currencyFound) {
          throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
        }
      }),
    ],
    updateUser,
  );

export default router;
