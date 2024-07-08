import Transference, { INACTIVE, ACTIVE } from "./transference.model.js";
import Account from "../account/account.model.js";
import Product from "../product/product.model.js";
import Purchase from "../purchase/purchase.model.js"
import {} from "../purchase/purchase.error.js";
import {
    AccountInsufficientFundsError,
    AccountNotFound,
  } from "../account/account.error.js";
import {
    ProductNotFound,
    InsufficientStock,
} from "../product/product.error.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import mongoose from "mongoose";
import moment from "moment";

export const createPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const LL = getTranslationFunctions(req.locate);
  try {
    logger.info("Starting generate a purchase");

    const { purchaser, product, quantity, currency } = req.body;

    const account_ = await Account.findById(purchaser);
    const product_ = await Product.findById(product);

    const total = product_.price*quantity;

    const purchase = new Purchase(
      cleanObject({
        purchaser,
        product,
        quantity,
        total,
        currency,
      }),
    );

    logger.info("Transferece succesfully", purchase);
  } catch (error) {
    await session.abortTransaction();
    logger.error("Purchase error type: , error.name");
    handleResponse(res, error, LL);
  } finally {
    session.endSession();
  }
};