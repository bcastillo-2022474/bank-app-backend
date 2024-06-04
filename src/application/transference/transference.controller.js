import { response } from "express";
import Transference, { INACTIVE } from "./transference.model.js";
import Currency from "../currency/currency.model.js";
import Account from "../account/account.model.js";
import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import { StatusCodes } from "http-status-codes";
import { cleanObject } from "../../utils/clean-object.js";
import { message } from "../../utils/message.js";

export const createTransference = async (req, res) => {
  const LL = getTranslationFunctions(req.locate);
  try {
    logger.info("Starting generate a transference");

    const { account_given, account_reciver, quantity, currency } = req.body;

    const account_g = await Account.findById(account_given);
    const account_r = await Account.findById(account_reciver);
    
    if( account_g.currency !=  account_r.currency ){
        throw new Error
    }
    if( account_g.currency !=  currency ){
        throw new Error
    }
    if( account_g.balance < quantity ){
        throw new Error
    }

    account_g.balance =  account_g.balance - quantity;
    account_r.balance =  account_r.balance + quantity;

    const transference = new (cleanObject({
        account_given, 
        account_reciver, 
        quantity, 
        currency,
    }),);

    await transference.save();
    await account_g.save();
    await account_r.save();

    res.status(StatusCodes.CREATED).json({
        message: LL.TRANSFERENCE.CONTROLLER.ESOTILIN(),
        data: transference
    })

    logger.info("Transferece succesfully", transference)
  } catch (error) {
    // const { code, stack, type } = getError(error);
    // logger.error("Create currency controller error of type:", type);
    // logger.error(stack);
    // res.status(code).json({
    //   message: LL.GENERAL.ROUTES.INTERNAL_SERVER_ERROR(),
    //   error,
    // });
  }
};
