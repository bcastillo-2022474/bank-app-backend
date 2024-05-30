import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { getTranslationFunctions } from "./src/utils/get-translations-locale.js";
import { StatusCodes } from "http-status-codes";
import dbConnection from "./src/db/db-connection.js";
import { printLanguage } from "./src/middleware/print-language.js";
import { retrieveLocale } from "./src/middleware/retrieve-locale.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: [".env", ".env.example"],
  });
}

if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: [".env.test"],
  });
  // IF NODE_ENV is test, we should connect to the test database
  // here, since later on it will be impossible to change the connection
  await dbConnection();
}

export const app = express();

// eslint-disable-next-line @joao-cst/enforce-consistent-return-express
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(printLanguage);
app.use(retrieveLocale);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Hello World", data: undefined });
});

app.use("*", (req, res) => {
  const locale = (req.headers["accept-language"] || "en").slice(0, 2);
  console.log({ locale, headers: req.headers });
  const LL = getTranslationFunctions(locale);

  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: LL.ENDPOINT_NOT_FOUND(), data: undefined });
});
