import { response } from "express";
import Payout, { INACTIVE } from "./payout.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { PayoutNotFound, getError } from "./payout.error.js";
import { cleanObject } from "../../utils/clean-object.js";

export const getAllPayout = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all payout");

    const { limit = 0, page = 0 } = req.query;
    const [total, payout] = await Promise.all([
        Payout.countDocuments(),
        Payout.find()
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: payout,
      total,
    });

    logger.info("Payout retrieved successfull");
  } catch (error) {
    const { code, stack, type } = getError(error);

    logger.error("Get all payout controller error of type: ", type);
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};

export const createPayout = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting create payout");

    const { service, total, debited_account } = req.body;

    const payout = new Payout(
      cleanObject({
        service,
        total,
        debited_account,
      }),
    );

    await payout.save();

    res.status(StatusCodes.CREATED).json({
      message: LL.PAYOUT.CONTROLLER.CREATED(),
      data: payout,
    });

    logger.info("Payout created successfully", payout);
  } catch (error) {
    const { code, stack, type } = getError(error);

    logger.error("Create payout controller error of type:", type);
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};

export const updatePayout = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting update payout");

    const { id } = req.params;
    const { service, total, debited_account } = req.body;

    const payout = await Payout.findByIdAndUpdate(
      id,
      cleanObject({ service, total, debited_account }),
      { new: true },
    );

    if (!payout) {
      throw new PayoutNotFound(LL.PAYOUT.ERROR.PAYOUT_NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.UPDATED(),
      data: payout,
    });

    logger.info("Payout created successfully", payout);
  } catch (error) {
    const { code, stack, type } = getError(error);

    logger.error("Update payout controller error of type:", type);
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};

export const deletePayoutById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting delete payout by id");

    const { id } = req.params;
    const payout = await Payout.findByIdAndUpdate(
      id,
      { tp_status: INACTIVE },
      { new: true },
    );
    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.DELETED(),
      data: payout,
    });

    logger.info("Payout deleted successfully", payout);
  } catch (error) {
    const { code, stack, type } = getError(error);

    logger.error("Delete payout controller error of type:", type);
    logger.error(stack);

    res.status(code).json({
      message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
      error,
    });
  }
};
