import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const currencySchema = new Schema({
  symbol: {
    type: String,
    required: [true, L.en.DB_SYMBOL_REQUIRED()],
  },
  name: {
    type: String,
    required: [true, L.en.DB_NAME_REQUIRED()],
  },
  key: {
    type: String,
    required: [true, L.en.DB_KEY_REQUIRED()],
  },
  tp_status: {
    type: String,
    required: [true, L.en.DB_TP_STATUS_REQUIRED()],
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, L.en.DB_CREATED_AT_REQUIRED()],
  },
  updated_at: {
    type: Date,
  },
});

// This ensures that each 'symbol' is unique only among active currencies
currencySchema.index(
  { symbol: 1, tp_status: 1 },
  // this makes the index to take effect only on active currencies
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

// This ensures that each 'name' is unique only among active currencies
currencySchema.index(
  { name: 1, tp_status: 1 },
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

// This ensures that each 'key' is unique only among active currencies
currencySchema.index(
  { key: 1, tp_status: 1 },
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

export default model("Currency", currencySchema);
