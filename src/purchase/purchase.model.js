import { Schema, model } from "mongoose";
import { L } from "../../i18n/i18n-node.js";
// AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const purchaseSchema = new Schema({
  purchaser: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.DB_PURCHASER_ACCOUNT_REQUIRED()],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, L.en.DB_PRODUCT_REQUIRED()],
  },
  quantity: {
    type: Number,
    required: [true, L.en.DB_QUANTITY_REQUIRED()],
  },
  total: {
    type: Schema.Types.Decimal128,
    required: [true, L.en.DB_TOTAL_REQUIRED()],
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

export default model("Purchase", purchaseSchema);
