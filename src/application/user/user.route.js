import { Router } from "express";
import {
  createUserWithAccount,
  getAllUsers,
  getUserById,
  deleteUserById,
} from "./user.controller.js"; // Ajusta la importación
import { body, query, param } from "express-validator"; // Incluye query para validación de parámetros de consulta
import { validateChecks } from "../../middleware/validate-checks.js";
import User, { ACTIVE } from "./user.model.js";
import { UserAlreadyExist } from "./user.error.js";
import { message } from "../../utils/message.js";
import { custom } from "../../middleware/custom.js";

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

      // CUSTOM MIDDLEWARES
      custom(async (req, LL) => {
        const { email } = req.body;

        // verifies if the email already exists in the database
        const user = await User.findOne({ email, tp_status: ACTIVE });
        if (user) {
          throw new UserAlreadyExist(LL.USER.ERROR.EMAIL_ALREADY_EXIST());
        }
      }),
      custom(async (req, LL) => {
        const { username } = req.body;

        // verifies if the username already exists in the database
        const user = await User.findOne({ username, tp_status: ACTIVE });
        if (user) {
          throw new UserAlreadyExist(LL.USER.ERROR.USERNAME_ALREADY_EXIST());
        }
      }),
    ],
    createUserWithAccount,
  );
router.route("/:id").get(
  [
    param(
      "id",
      message((LL) => LL.USER.ROUTES.INVALID_USER_ID()),
    ).isMongoId(), // Validación del ID del usuario
    validateChecks,
  ],
  getUserById, // Llama al controlador para obtener al usuario y sus cuentas por ID
);
router.delete(
  "/:id",
  message((LL) => LL.USER.ROUTES.INVALID_USER_ID()),
  [param("id", "Invalid user ID").isMongoId(), validateChecks],
  deleteUserById,
);

export default router;
