import { Schema, model } from "mongoose";
import { L } from "../../i18n/i18n-node.js";

const { Decimal128 } = require("mongoose").Schema.Types;

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const payoutSchema = new Schema({
  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: [true, L.en.DB_SERVICE_REQUIRED()],
  },
  total: {
    type: Decimal128,
    required: [true, L.en.DB_TOTAL_REQUIRED()],
  },
  debited_account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.DB_DEBITED_ACCOUNT_REQUIRED()],
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

export default model("Payout", payoutSchema);
