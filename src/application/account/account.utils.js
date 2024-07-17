import { logger } from "../../utils/logger.js";
import Transference from "../transference/transference.model.js";
import Transaction from "../transaction/transaction.model.js";
import Purchase from "../purchase/purchase.model.js";
import Payout from "../payout/payout.model.js";

export const getUsage = async (account) => {
  try {
    logger.info("Starting get usage for account");
    const [transfersCount, transactionsCount, purchasesCount, payoutsCount] =
      await Promise.all([
        Transference.countDocuments({ accountId: account._id }),
        Transaction.countDocuments({ accountId: account._id }),
        Purchase.countDocuments({ accountId: account._id }),
        Payout.countDocuments({ accountId: account._id }),
      ]);
    const totalUsage =
      transfersCount + transactionsCount + purchasesCount + payoutsCount;
    return {
      account,
      totalUsage,
    };
  } catch (error) {
    logger.error("Get usage controller error of type: ", error.name);
  }
};
