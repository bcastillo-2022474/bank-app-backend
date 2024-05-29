import { Schema, model } from "mongoose";
import { L } from "../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const favoriteAccountsSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.DB_ACCOUNT_REQUIRED()],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.DB_OWNER_REQUIRED()],
  },
  alias: {
    type: String,
    unique: true,
    required: [true, L.en.DB_ALIAS_REQUIRED()],
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
    default: Date.now,
    required: [true, L.en.DB_UPDATED_AT_REQUIRED()],
  },
});

const favoriteAccountsModel = model("FavoriteAccounts", favoriteAccountsSchema);

export default favoriteAccountsModel;
