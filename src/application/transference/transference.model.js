import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

export const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const transferenceSchema = new Schema({
  account_given: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.TRANSFERENCE.DB.ACCOUNT_GIVEN_REQUIRED()],
  },
  account_reciver: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.TRANSFERENCE.DB.ACCOUNT_RECIVER_REQUIRED()],
  },
  quantity: {
    type: Schema.Types.Decimal128,
    required: [true, L.en.TRANSFERENCE.DB.QUANTITY_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.TRANSFERENCE.DB.CURRENCY_REQUIRED()],
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
  },
  tp_status: {
    type: String,
    required: [true, L.en.GENERAL.DB.TP_STATUS_REQUIRED()],
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
  },
});

export default model("Transference", transferenceSchema);
