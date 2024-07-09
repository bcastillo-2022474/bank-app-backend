import { Router } from "express";
import { body } from "express-validator";
import { validateChecks } from "../../middleware/validate-checks.js";
import { login, validateToken } from "./auth.controller.js";
import { validateJwt } from "../../middleware/validate-jwt.js";

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").isString().isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
    validateChecks,
  ],
  login,
);

router.get("/token", validateJwt, validateToken);

export default router;
