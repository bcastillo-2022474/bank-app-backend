import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

export const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, L.en.USER.DB.EMAIL_REQUIRED()],
  },
  username: {
    type: String,
    required: [true, L.en.USER.DB.USERNAME_REQUIRED()],
  },
  password: {
    type: String,
    required: [true, L.en.USER.DB.PASSWORD_REQUIRED()],
  },
  name: {
    type: String,
    required: [true, L.en.USER.DB.NAME_REQUIRED()],
  },
  last_name: {
    type: String,
    required: [true, L.en.USER.DB.LAST_NAME_REQUIRED()],
  },
  address: {
    type: String,
    required: [true, L.en.USER.DB.ADDRESS_REQUIRED()],
  },
  DPI: {
    type: String,
    required: [true, L.en.USER.DB.DPI_REQUIRED()],
  },
  phone_number: {
    type: String,
    required: [true, L.en.USER.DB.PHONE_NUMBER_REQUIRED()],
  },
  job_name: {
    type: String,
    required: [true, L.en.USER.DB.JOB_NAME_REQUIRED()],
  },
  monthly_income: {
    type: Number,
    required: [true, L.en.USER.DB.MONTHLY_INCOME_REQUIRED()],
  },
  currency_income: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: [true, L.en.USER.DB.CURRENCY_INCOME_REQUIRED()],
  },
  main_account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: [true, L.en.USER.DB.MAIN_ACCOUNT_REQUIRED()],
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: [],
    },
  ],
  created_at: {
    type: Date,
    required: [true, L.en.GENERAL.DB.CREATED_AT_REQUIRED()],
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  tp_status: {
    type: String,
    enum: [ACTIVE, INACTIVE],
    required: [true, L.en.GENERAL.DB.TP_STATUS_REQUIRED()],
    default: ACTIVE,
  },
});

// This ensures that each 'email' is unique only among active currencies
UserSchema.index(
  { email: 1, tp_status: 1 },
  // this makes the index to take effect only on active currencies
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

// This ensures that each 'username' is unique only among active currencies
UserSchema.index(
  { username: 1, tp_status: 1 },
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

export default model("User", UserSchema);
