import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

export const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const serviceSchema = new Schema({
  name: {
    type: String,
    required: [true, L.en.SERVICE.DB.NAME_REQUIRED()],
  },
  description: {
    type: String,
    required: [true, L.en.SERVICE.DB.DESCRIPTION_REQUIRED()],
  },
  price: {
    type: Number,
    required: [true, L.en.SERVICE.DB.PRICE_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.SERVICE.DB.CURRENCY_REQUIRED()],
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, L.en.GENERAL.DB.CREATED_AT_REQUIRED()],
  },
  updated_at: {
    type: Date,
  },
  tp_status: {
    type: String,
    required: [true, L.en.GENERAL.DB.TP_STATUS_REQUIRED()],
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
  },
});

export default model("Service", serviceSchema);
