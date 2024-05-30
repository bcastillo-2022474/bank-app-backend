import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const UserSchema = Schema({
  email: {
    type: String,
    required: [true, L.en.DB_EMAIL_REQUIRED()],
  },
  username: {
    type: String,
    required: [true, L.en.DB_USERNAME_REQUIRED()],
  },
  password: {
    type: String,
    required: [true, L.en.DB_PASSWORD_REQUIRED()],
  },
  name: {
    type: String,
    required: [true, L.en.DB_NAME_REQUIRED()],
  },
  last_name: {
    type: String,
    required: [true, L.en.DB_LASTNAME_REQUIRED()],
  },
  address: {
    type: String,
    required: [true, L.en.DB_ADDRESS_REQUIRED()],
  },
  DPI: {
    type: String,
    required: [true, L.en.DB_DPI_REQUIRED()],
  },
  phone_number: {
    type: String,
    required: [true, L.en.DB_PHONE_NUMBER_REQUIRED()],
  },
  job_name: {
    type: String,
    required: [true, L.en.DB_JOB_NAME_REQUIRED()],
  },
  monthly_income: {
    type: Number,
    required: [true, L.en.DB_MONTHLY_INCOME_REQUIRED()],
  },
  currency_income: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
  },
  main_account: {
    type: Schema.Types.ObjectId,
    ref: "Acount",
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Acount",
      default: [],
    },
  ],
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  tp_status: {
    type: String,
    enum: [ACTIVE, INACTIVE],
    required: true,
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
