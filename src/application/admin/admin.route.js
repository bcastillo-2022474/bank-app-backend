import { Router } from "express";
import { createAdmin } from "./admin.controller.js"; // Ajusta la importación
import { body, query } from "express-validator"; // Incluye query para validación de parámetros de consulta
import { validateChecks } from "../../middleware/validate-checks.js";
import Admin, { ACTIVE } from "./admin.model.js";
import { AdminAlreadyExist } from "./admin.error.js"; // Ajusta la importación del error
import { message } from "../../utils/message.js";
import { custom } from "../../middleware/custom.js";

const router = Router();

router.route("/").post(
  [
    body(
      "email",
      message((LL) => LL.ADMIN.ROUTES.ADMIN_EMAIL()),
    ).isEmail(),
    body(
      "username",
      message((LL) => LL.ADMIN.ROUTES.INVALID_USERNAME()),
    )
      .isString()
      .isLength({ min: 3, max: 255 }),
    body(
      "password",
      message((LL) => LL.ADMIN.ROUTES.INVALID_PASSWORD()),
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    body(
      "name",
      message((LL) => LL.ADMIN.ROUTES.INVALID_NAME()),
    )
      .isString()
      .isLength({ min: 3, max: 255 }),
    body(
      "last_name",
      message((LL) => LL.ADMIN.ROUTES.INVALID_LAST_NAME()),
    )
      .isString()
      .isLength({ min: 3, max: 255 }),
    validateChecks,

    // CUSTOM MIDDLEWARES
    custom(async (req, LL) => {
      const { email } = req.body;

      // Verifica si el email ya existe en la base de datos
      const admin = await Admin.findOne({ email, tp_status: ACTIVE });
      if (admin) {
        throw new AdminAlreadyExist(LL.ADMIN.ERROR.EMAIL_ALREADY_EXIST());
      }
    }),
    custom(async (req, LL) => {
      const { username } = req.body;

      // Verifica si el nombre de usuario ya existe en la base de datos
      const admin = await Admin.findOne({ username, tp_status: ACTIVE });
      if (admin) {
        throw new AdminAlreadyExist(LL.ADMIN.ERROR.USERNAME_ALREADY_EXIST());
      }
    }),
  ],
  createAdmin,
);

export default router;
