import { logger } from "../utils/logger.js";
import { getTranslationFunctions } from "../utils/get-translations-locale.js";
import { StatusCodes } from "http-status-codes";
import { ProductNotFound } from "../application/product/product.error.js";
import Product from "../application/product/product.model.js";

export const addStockToProduct = (fn) => {
  return async (req, res, next) => {
    const LL = getTranslationFunctions(req.locale);
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);

      if (!product) {
        throw new ProductNotFound(LL.PRODUCT.ERROR.NOT_FOUND());
      }

      product.stock += quantity;

      await product.save();

      await fn(req, res, next);
    } catch (error) {
      logger.error(
        "Add stock to product middleware error of type: ",
        error.name,
      );
      logger.error(error.stack);

      res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
};
