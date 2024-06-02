import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];
const [DEPOSIT, WITHDRAWAL] = ["DEPOSIT", "WITHDRAWAL"];

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: [DEPOSIT, WITHDRAWAL],
    required: [true, L.en.TRANSACTION.DB.TYPE_REQUIRED()],
  },
  quantity: {
    type: Number,
    required: [true, L.en.TRANSACTION.DB.QUANTITY_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.TRANSACTION.DB.CURRENCY_REQUIRED()],
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.TRANSACTION.DB.ACCOUNT_REQUIRED()],
  },
  tp_status: {
    type: String,
    required: [true, L.en.GENERAL.DB.TP_STATUS_REQUIRED()],
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, L.en.GENERAL.DB.CREATED_AT_REQUIRED()],
  },
  updated_at: {
    type: Date,
  },
});

export default model("Transaction", transactionSchema);
