import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./src/db/db-connection.js";
import { getTranslationFunctions } from "./src/utils/get-translations-locale.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: [".env", ".env.example"],
  });
}

export const app = express();

const { PORT } = process.env;

// eslint-disable-next-line @joao-cst/enforce-consistent-return-express
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello World", data: undefined });
});

app.use("*", (req, res) => {
  const locale = req.headers["accept-language"].slice(0, 2) || "en";
  console.log({ locale, headers: req.headers });
  const LL = getTranslationFunctions(locale);

  res.status(404).json({ message: LL.ENDPOINT_NOT_FOUND(), data: undefined });
});

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => {
    console.error(error);
    console.log("UNABLE TO CONNECT TO DATABASE");
  });
