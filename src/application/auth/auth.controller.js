import bcryptjs from "bcryptjs";
import User, { ACTIVE } from "../user/user.model.js";
import { logger } from "../../utils/logger.js";
import { generateToken } from "../../utils/generate-token.js";
import { StatusCodes } from "http-status-codes";
import LL from "../../../i18n/en/index.js";
import { handleResponse } from "../../utils/handle-reponse.js";

class CredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = "CredentialsError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export const login = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    logger.info("Login endpoint start");

    const isAdmin = false; // JUST FOR NOW

    // const isAdmin = await Admin.findOne({
    //   tp_status: ACTIVE,
    //   $or: [{ email }, { username }],
    // });

    const isUser = await User.findOne({
      tp_status: ACTIVE,
      $or: [{ email }, { username }],
    });

    const user = isAdmin || isUser;

    if (!user) {
      throw new CredentialsError(LL.AUTH.ERROR.EMAIL_NOT_FOUND());
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      throw new CredentialsError(LL.AUTH.ERROR.INVALID_PASSWORD());
    }

    const token = await generateToken(user.toJSON());
    res.status(200).json({ message: "Login successful", data: user, token });
    logger.info("Login successful");
  } catch (error) {
    logger.error("Error logging of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const validateToken = async (req, res) => {
  try {
    logger.info("Token validation endpoint start");

    res.status(200).json({
      message: LL.AUTH.CONTROLLER.SUCCESS_TOKEN_VALIDATION(),
      data: req.loggedUser,
    });

    logger.info("Token validation successful");
  } catch (error) {
    logger.error("Error validating token and getting virtuals: ", error.name);

    handleResponse(res, error, LL);
  }
};
