import { Router } from "express";
import {
  createUserWithAccount,
  getAllUsers,
  getUserAccountsById,
} from "./user.controller.js"; // Ajusta la importación
import { body, query, param } from "express-validator"; // Incluye query para validación de parámetros de consulta
import { validateChecks } from "../../middleware/validate-checks.js";
import User, { ACTIVE } from "./user.model.js";
import { UserAlreadyExist } from "./user.error.js";
import { message } from "../../utils/message.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";

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
    getAllUsers,
  )
  .post(
    [
      body("email")
        .isEmail()
        .withMessage(message((LL) => LL.USER.ROUTES.USER_EMAIL())) // Si la última verificación falla, se mostrará este mensaje
        .custom(async (email, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Verifica si el correo electrónico ya existe en la base de datos
          const user = await User.findOne({ email, tp_status: ACTIVE });
          if (user) {
            throw new UserAlreadyExist(LL.USER.ERROR.EMAIL_ALREADY_EXIST);
          }

          return true;
        }),
      body("username")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_USERNAME())) // Validación del nombre de usuario
        .custom(async (username, { req }) => {
          const LL = getTranslationFunctions(req.locale);
          // Verifica si el nombre de usuario ya existe en la base de datos
          const user = await User.findOne({ username, tp_status: ACTIVE });
          if (user) {
            throw new UserAlreadyExist(LL.USER.ERROR.USERNAME_ALREADY_EXIST);
          }

          return true;
        }),

      body("password")
        .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
        })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_PASSWORD())),

      body("name")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_NAME())),
      body("last_name")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_LAST_NAME())),
      body("address")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_ADDRESS())),
      body("DPI")
        .isString()
        .isLength({ min: 13, max: 13 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_DPI())),
      body("phone_number")
        .isString()
        .isLength({ min: 8, max: 8 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_PHONE_NUMBER())),
      body("job_name")
        .isString()
        .isLength({ min: 3, max: 255 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_JOB_NAME())),
      body("monthly_income")
        .isFloat({ min: 0 })
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_MONTHLY_INCOME())),
      body("currency_income")
        .isMongoId()
        .withMessage(message((LL) => LL.USER.ROUTES.INVALID_CURRENCY_INCOME())),
      validateChecks,
    ],
    createUserWithAccount,
  );
router.route("/:id").get(
  [
    param("id").isMongoId().withMessage("Invalid user ID"), // Validación del ID del usuario
    validateChecks,
  ],
  getUserAccountsById, // Llama al controlador para obtener las cuentas del usuario por su ID
);

export default router;
