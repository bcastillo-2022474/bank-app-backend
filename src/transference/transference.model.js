import { Schema, model } from "mongoose";
import { L } from "../../i18n/i18n-node.js";
const { Decimal128 } = require("mongoose").Schema.Types;

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const transferenceSchema = new Schema({
  account_given: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.DB_ACCOUNT_GIVEN_REQUIRED()],
  },
  account_reciver: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.DB_ACCOUNT_RECIVER_REQUIRED()],
  },
  quantity: {
    type: Decimal128,
    required: [true, L.en.DB_QUANTITY_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.DB_CURRENCY_REQUIRED()],
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
    required: [true, L.en.DB_TP_STATUS_REQUIRED()],
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
  },
});

export default model("Transference", transferenceSchema);
