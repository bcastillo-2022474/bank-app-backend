import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

const favoriteAccountsSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.FAVORITE_ACCOUNT.DB.ACCOUNT_REQUIRED()],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.FAVORITE_ACCOUNT.DB.OWNER_REQUIRED()],
  },
  alias: {
    type: String,
    required: [true, L.en.FAVORITE_ACCOUNT.DB.ALIAS_REQUIRED()],
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: [true, L.en.GENERAL.DB.CREATED_AT_REQUIRED()],
  },
  updated_at: {
    type: Date,
  },
});

// Create a compound index on the 'account' and 'owner' fields
// This ensures that a combination of 'account' and 'owner' is unique
// Meaning, a specific 'account' can only be marked as a favorite once per 'owner'
// If a combination of 'account' and 'owner' already exists, an error will be thrown
favoriteAccountsSchema.index({ account: 1, owner: 1 }, { unique: true });

// Create a compound index on the 'alias' and 'owner' fields
// This ensures that a combination of 'alias' and 'owner' is unique
// Meaning, a specific 'alias' can only exist once per 'owner'
// If a combination of 'alias' and 'owner' already exists, an error will be thrown
favoriteAccountsSchema.index({ alias: 1, owner: 1 }, { unique: true });

export default model("FavoriteAccounts", favoriteAccountsSchema);
