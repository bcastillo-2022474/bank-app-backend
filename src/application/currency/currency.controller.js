import { response } from "express";
import Currency from "./currency.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";

export const getAllCurrencies = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    const { limit = 0, page = 0 } = req.query;
    console.log({ limit, page });
    const [total, currency] = await Promise.all([
      Currency.countDocuments(),
      Currency.find()
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.CURRENCIES_RETRIEVED_SUCCESSFULLY(),
      data: currency,
      total,
    });
  } catch (error) {
    logger.error("Exist error", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: LL.INTERNAL_SERVER_ERROR(), error });
  }
};

export const createCurrency = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    const { symbol, name, key } = req.body;

    const currency = new Currency({ symbol, name, key });

    await currency.save();
    res.status(StatusCodes.CREATED).json({
      message: LL.CURRENCY_CREATED(),
      data: currency,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: LL.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};

export const updateCurrency = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    const { id } = req.params;
    const { symbol, name, key } = req.body;

    const currency = await Currency.findById(id);

    currency.symbol = symbol;
    currency.name = name;
    currency.key = key;

    await currency.save();

    res.status(StatusCodes.OK).json({
      message: LL.CURRENCY_UPDATED(),
      data: currency,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: LL.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};

export const deleteCurrencyById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    const { id } = req.params;
    const currency = await Currency.findByIdAndDelete(id, { new: true });
    res.status(StatusCodes.OK).json({
      message: LL.CURRENCIES_RETRIEVED_DELETE(),
      data: currency,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: LL.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};
