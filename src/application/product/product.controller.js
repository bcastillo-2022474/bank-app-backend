import { response } from "express";
import Product, { ACTIVE, INACTIVE } from "./product.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { ProductNotFound } from "./product.error.js";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import Currency from "../currency/currency.model.js";
import { CurrencyNotFound } from "../currency/currency.error.js";

export const getAllProducts = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all products");

    const { limit = 0, page = 0 } = req.query;
    const query = { tp_status: ACTIVE };
    const [total, products] = await Promise.all([
      Product.countDocuments(query),

      Product.find(query)
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PRODUCT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: products,
      total,
    });

    logger.info("Products retrieved successfully");
  } catch (error) {
    logger.error("Get all products controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const createProduct = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting create product");

    const { name, description, price, currency, stock } = req.body;

    const currencyFound = await Currency.findOne({
      _id: currency,
      tp_status: ACTIVE,
    });

    if (!currencyFound) {
      throw new CurrencyNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
    }

    const product = new Product(
      cleanObject({
        name,
        description,
        price,
        currency,
        stock,
      }),
    );

    await product.save();

    res.status(StatusCodes.CREATED).json({
      message: LL.PRODUCT.CONTROLLER.CREATED(),
      data: product,
    });

    logger.info("Product created successfully", product);
  } catch (error) {
    logger.error("Create product controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};

export const updateProduct = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting update product");

    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findOne({ _id: id, tp_status: ACTIVE });

    if (!product) {
      throw new ProductNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
    }

    if (updateData.stock) {
      updateData.stock += product.stock;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, tp_status: ACTIVE },
      updateData,
      {
        new: true,
      },
    );

    res.status(StatusCodes.OK).json({
      message: LL.PRODUCT.CONTROLLER.UPDATED(),
      data: updatedProduct,
    });

    logger.info("Product updated successfully", updatedProduct);
  } catch (error) {
    logger.error("Update product controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};

export const deleteProductById = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting delete product by id");

    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { tp_status: INACTIVE },
      { new: true },
    );
    res.status(StatusCodes.OK).json({
      message: LL.PRODUCT.CONTROLLER.DELETED(),
      data: product,
    });

    logger.info("Product deleted successfully", product);
  } catch (error) {
    logger.error("Delete product controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};

export const addStockToProduct = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting add stock to product");

    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      throw new ProductNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
    }

    product.stock += stock;
    await product.save();

    res.status(StatusCodes.OK).json({
      message: LL.PRODUCT.CONTROLLER.STOCK_ADDED(),
      data: product,
    });

    logger.info("Stock added to product successfully", product);
  } catch (error) {
    logger.error("Add stock to product controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};

export const getProductById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);

  try {
    logger.info("Starting add stock to product");
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      tp_status: ACTIVE,
    });

    res.status(StatusCodes.OK).json({
      message: LL.PRODUCT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: product,
    });

    logger.info("Product retrieved successfully", product);
  } catch (error) {
    logger.error("Get product by ID controller error of type:", error.name);
    handleResponse(res, error, LL);
  }
};
