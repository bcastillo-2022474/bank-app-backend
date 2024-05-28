import { Schema, model } from "mongoose";
import { L } from "../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const currencySchema = new Schema({
  symbol: {
    type: String,
    unique: true,
    required: [true, L.en.DB_SYMBOL_REQUIRED],
  },
  name: {
    type: String,
    unique: true,
    required: [true, L.en.DB_NAME_REQUIRED],
  },
  key: {
    type: String,
    unique: true,
    required: [true, L.en.DB_KEY_REQUIRED],
  },
  tp_status: {
    type: String,
    required: [true, L.en.DB_TP_STATUS_REQUIRED],
    enum: [ACTIVE, INACTIVE],
    default: ACTIVE,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, L.en.DB_CREATED_AT_REQUIRED],
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: [true, L.en.DB_UPDATED_AT_REQUIRED],
  },
});

const currencyModel = model("Currency", currencySchema);

export default currencyModel;
