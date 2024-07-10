import { response } from "express";
import Payout, { ACTIVE, INACTIVE } from "./payout.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import Account from "../account/account.model.js";
import mongoose from "mongoose";

export const getAllPayout = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Starting get all payout");

    const { limit = 0, page = 0 } = req.query;

    const query = { tp_status: ACTIVE };

    const [total, payout] = await Promise.all([
      Payout.countDocuments(query),
      Payout.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: payout,
      total,
    });

    logger.info("Payout retrieved successfully");
  } catch (error) {
    logger.error("Get all Payout controller error of type: ", error.name);
    handleResponse(error, LL);
  }
};

export const getAllPayoutsByAccount = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  const { accountId } = req.params;
  try {
    logger.info("Starting get all payouts by account id");

    const { limit = 0, page = 0 } = req.query;

    const query = { debited_account: accountId, tp_status: ACTIVE };

    const [total, payout] = await Promise.all([
      Payout.countDocuments(query),
      Payout.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: payout,
      total,
    });

    logger.info("Payout retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all Payouts by Account controller error of type: ",
      error.name,
    );
    handleResponse(error, LL);
  }
};

export const getAllPayoutsByServiceId = async (req, res = response) => {
  const LL = getTranslationFunctions(req.locale);
  const { serviceId } = req.params;
  try {
    logger.info("Starting get all payouts by service id");

    const { limit = 0, page = 0 } = req.query;

    const query = { service: serviceId, tp_status: ACTIVE };

    const [total, payout] = await Promise.all([
      Payout.countDocuments(query),
      Payout.find(query)
        .skip(limit * page)
        .limit(limit),
    ]);

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      data: payout,
      total,
    });

    logger.info("Payout retrieved successfully");
  } catch (error) {
    logger.error(
      "Get all Payouts by Service controller error of type: ",
      error.name,
    );
    handleResponse(error, LL);
  }
};

export const createPayout = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const session = await mongoose.startSession();
  await session.startTransaction();
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

    await Account.findOneAndUpdate(
      {
        _id: debited_account,
        tp_status: ACTIVE,
      },
      {
        $inc: { balance: -total },
      },
    );

    await payout.save();
    await session.commitTransaction();

    res.status(StatusCodes.CREATED).json({
      message: LL.PAYOUT.CONTROLLER.CREATED(),
      data: payout,
    });

    logger.info("Payout created successfully", payout);
  } catch (error) {
    await session.abortTransaction();
    logger.error("Create User controller error of type: ", error.name);
    handleResponse(error, LL);
  } finally {
    session.endSession();
  }
};

export const deletePayoutById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    logger.info("Starting delete payout by id");

    const { id } = req.params;
    const payout = await Payout.findByIdAndUpdate(
      id,
      { tp_status: INACTIVE, update_at: new Date() },
      { new: true },
    );

    await Account.findOneAndUpdate(
      {
        _id: payout.debited_account,
        tp_status: ACTIVE,
      },
      {
        $inc: { balance: payout.total },
      },
    );

    await session.commitTransaction();

    res.status(StatusCodes.OK).json({
      message: LL.PAYOUT.CONTROLLER.DELETED(),
      data: payout,
    });

    logger.info("Payout deleted successfully", payout);
  } catch (error) {
    await session.abortTransaction();

    logger.error("Delete Payout controller error of type: ", error.name);
    handleResponse(error, LL);
  } finally {
    session.endSession();
  }
};
