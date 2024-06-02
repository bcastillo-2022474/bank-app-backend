import { Schema, model } from "mongoose";
const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];
import { L } from "../../../i18n/i18n-node.js";

const AccountSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, L.en.ACCOUNT.DB.OWNER_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.ACCOUNT.DB.CURRENCY_REQUIRED()],
  },
  balance: {
    type: Number,
    required: [true, L.en.ACCOUNT.DB.BALANCE_REQUIRED()],
  },
  tp_status: {
    type: String,
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
    required: [true, L.en.GENERAL.DB.TP_STATUS_REQUIRED()],
  },
});

export default model("Account", AccountSchema);
