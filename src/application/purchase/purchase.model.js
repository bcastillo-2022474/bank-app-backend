import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const purchaseSchema = new Schema({
  purchaser: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.PURCHASE.DB.PURCHASER_REQUIRED()],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, L.en.PURCHASE.DB.PRODUCT_REQUIRED()],
  },
  quantity: {
    type: Number,
    required: [true, L.en.PURCHASE.DB.QUANTITY_REQUIRED()],
  },
  total: {
    type: Number,
    required: [true, L.en.PURCHASE.DB.TOTAL_REQUIRED()],
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.PURCHASE.DB.CURRENCY_REQUIRED()],
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

export default model("Purchase", purchaseSchema);
