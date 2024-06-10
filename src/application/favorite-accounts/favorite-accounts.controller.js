import { response } from "express";
import FavoriteAccounts from "./favorite-accounts.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { FavoriteAccountsNotFound } from "./favorite-accounts.error.js";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";

export const getAllfavoriteAccounts = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all favorite accounts");

    const { limit = 0, page = 0 } = req.query;
    const [total, favoriteAccounts] = await Promise.all([
      FavoriteAccounts.countDocuments(),
      FavoriteAccounts.find()
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.FAVORITE_ACCOUNT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: favoriteAccounts,
      total,
    });

    logger.info("Favorite accounts retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all favorite accounts controller error of type: ",
      error.account,
    );
    handleResponse(res, error, LL);
  }
};

export const createFavoriteAccounts = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting create favorite accounts");

    const { account, owner, alias } = req.body;

    const favoriteAccounts = new FavoriteAccounts(
      cleanObject({
        account,
        owner,
        alias,
      }),
    );

    await favoriteAccounts.save();

    res.status(StatusCodes.CREATED).json({
      message: LL.CURRENCY.CONTROLLER.CREATED(),
      data: favoriteAccounts,
    });

    logger.info("Favorite accounts created successfully", favoriteAccounts);
  } catch (error) {
    logger.error(
      "Create favorite accounts controller error of type: ",
      error.account,
    );
    handleResponse(res, error, LL);
  }
};

export const updateFavoriteAccounts = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting update favorite accounts");

    const { id } = req.params;
    const { account, owner, alias } = req.body;

    const favoriteAccounts = await FavoriteAccounts.findByIdAndUpdate(
      id,
      cleanObject({ account, owner, alias }),
      { new: true },
    );

    if (!favoriteAccounts) {
      throw new FavoriteAccountsNotFound(LL.CURRENCY.ERROR.NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      message: LL.CURRENCY.CONTROLLER.UPDATED(),
      data: favoriteAccounts,
    });

    logger.info("Favorite accounts created successfully", favoriteAccounts);
  } catch (error) {
    logger.error(
      "Update favorite accounts controller error of type: ",
      error.account,
    );
    handleResponse(res, error, LL);
  }
};

export const deleteFavoriteAccountsById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting delete favorite accounts by id");

    const { id } = req.params;
    const favoriteAccounts = await FavoriteAccounts.findByIdAndUpdate(
      id,
      { tp_status: INACTIVE },
      { new: true },
    );
    res.status(StatusCodes.OK).json({
      message: LL.CURRENCY.CONTROLLER.DELETED(),
      data: favoriteAccounts,
    });

    logger.info("Favorite accounts deleted successfully", favoriteAccounts);
  } catch (error) {
    logger.error(
      "Delete favorite accounts controller error of type: ",
      error.account,
    );
    handleResponse(res, error, LL);
  }
};
