import Account from "../account/account.model.js";
import Purchase from "../purchase/purchase.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import mongoose from "mongoose";
import { ACTIVE, INACTIVE } from "../user/user.model.js";
import Product from "../product/product.model.js";
import { ProductNotEnoughStock } from "./purchase.errors.js";
import { getMoneyExchangeRate } from "./purchase.util.js";
import { AccountInsufficientFundsError } from "../account/account.error.js";

export const getAllPurcahse = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all purchase");

    const { limit = 0, page = 0 } = req.query;

    const query = { tp_status: ACTIVE };

    const [total, purchase] = await Promise.all([
      Purchase.countDocuments(query),
      Purchase.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PURCHASE.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: purchase,
      total,
    });

    logger.info("Purchase retrieved successfully");
  } catch (error) {
    logger.error("Get all Purchase controller error of type: ", error.name);
    handleResponse(error, LL);
  }
};

export const getPurchaseByAccount = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const { accountId } = req.params;
  try {
    logger.info("Starting get all purchase by account id");

    const { limit = 0, page = 0 } = req.query;

    const query = { purchaser: accountId, tp_status: ACTIVE };

    const [total, purchase] = await Promise.all([
      Purchase.countDocuments(query),
      Purchase.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PURCHASE.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: purchase,
      total,
    });

    logger.info("Purchase retrieved successfully");
  } catch (error) {
    logger.error("Get all Purchase controller error of type: ", error.name);
    handleResponse(error, LL);
  }
};

export const getPurchaseByProduct = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const { productId } = req.params;
  try {
    logger.info("Starting get all purchase by product id");

    const { limit = 0, page = 0 } = req.query;

    const query = { product: productId, tp_status: ACTIVE };

    const [total, purchase] = await Promise.all([
      Purchase.countDocuments(query),
      Purchase.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PURCHASE.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: purchase,
      total,
    });

    logger.info("Purchase retrieved successfully");
  } catch (error) {
    logger.error("Get all Purchase controller error of type: ", error.name);
    handleResponse(error, LL);
  }
};

export const getPurchaseById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const { id } = req.params;
  try {
    logger.info("Starting get purchase by id");

    const { limit = 0, page = 0 } = req.query;

    const query = { _id: id, tp_status: ACTIVE };

    const [total, purchase] = await Promise.all([
      Purchase.countDocuments(query),
      Purchase.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PURCHASE.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: purchase,
      total,
    });

    logger.info("Purchase retrieved successfully");
  } catch (error) {
    logger.error("Get all Purchase controller error of type: ", error.name);
    handleResponse(error, LL);
  }
};

export const createPurchase = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    logger.info("Starting create purchase");

    const { product, purchaser, quantity } = req.body;

    const accountFound = await Account.findOne({
      _id: purchaser,
      tp_status: ACTIVE,
    }).populate("currency");

    const productFound = await Product.findOneAndUpdate(
      {
        _id: product,
        tp_status: ACTIVE,
      },
      {
        // update stock
        $inc: { stock: -quantity },
      },
    ).populate("currency");

    if (productFound.stock < 0) {
      throw new ProductNotEnoughStock(LL.PRODUCT.ERROR.NOT_ENOUGH_STOCK());
    }

    const rate = await getMoneyExchangeRate(
      productFound.currency,
      accountFound.currency,
    );

    const total = quantity * product.price * rate;

    const purchase = new Purchase(
      cleanObject({
        product,
        total,
        purchaser,
        quantity,
        currency: accountFound.currency,
      }),
    );

    accountFound.balance -= total;
    if (accountFound.balance < 0) {
      throw new AccountInsufficientFundsError(
        LL.ACCOUNT.ERROR.INSUFFICIENT_BALANCE(),
      );
    }

    await accountFound.save();

    await purchase.save();
    await session.commitTransaction();

    res.status(StatusCodes.CREATED).json({
      message: LL.PAYOUT.CONTROLLER.CREATED(),
      data: purchase,
    });

    logger.info("Payout created successfully", purchase);
  } catch (error) {
    await session.abortTransaction();
    logger.error("Create User controller error of type: ", error.name);
    handleResponse(error, LL);
  } finally {
    session.endSession();
  }
};

export const deletePurchaseById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    logger.info("Starting delete payout by id");

    const { id } = req.params;
    const purchase = await Purchase.findByIdAndUpdate(
      id,
      { tp_status: INACTIVE, update_at: new Date() },
      { new: true },
    );

    await Account.findOneAndUpdate(
      {
        _id: purchase.purchaser,
        tp_status: ACTIVE,
      },
      {
        $inc: { balance: purchase.total },
      },
    );

    await session.commitTransaction();

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.DELETED(),
      data: purchase,
    });

    logger.info("Payout deleted successfully", purchase);
  } catch (error) {
    await session.abortTransaction();

    logger.error("Delete Payout controller error of type: ", error.name);
    handleResponse(error, LL);
  } finally {
    session.endSession();
  }
};
