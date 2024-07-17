import jwt from "jsonwebtoken";
import User from "../application/user/user.model.js";
import { StatusCodes } from "http-status-codes";

export const validateJwt = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    // eslint-disable-next-line @joao-cst/enforce-consistent-return-express
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token is required" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id, tp_status: "ACTIVE" });
    console.log({ _id, user });

    if (!user) {
      // eslint-disable-next-line @joao-cst/enforce-consistent-return-express
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found, this user might have been deleted" });
    }

    req.loggedUser = user;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token or token expired" });
  }
};
