import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

export const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, L.en.PRODUCT.DB.NAME_REQUIRED()],
  },
  description: {
    type: String,
    required: [true, L.en.PRODUCT.DB.DESCRIPTION_REQUIRED()],
  },
  price: {
    type: Number,
    required: [true, L.en.PRODUCT.DB.PRICE_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.PRODUCT.DB.CURRENCY_REQUIRED()],
  },
  stock: {
    type: Number,
    required: [true, L.en.PRODUCT.DB.STOCK_REQUIRED()],
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

export default model("Product", productSchema);
