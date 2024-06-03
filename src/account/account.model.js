import { Schema, model } from "mongoose";
export const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];
import { L } from "../../i18n/i18n-node.js";

const AccountSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, L.en.DB_OWNER_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.DB_CURRENCY_REQUIRED()],
  },
  balance: {
    type: Number,
    required: [true, L.en.DB_BALANCE_REQUIRED()],
  },
  tp_status: {
    type: String,
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
    required: [true, L.en.DB_TP_STATUS_REQUIRED()],
  },
});

export default model("Account", AccountSchema);
