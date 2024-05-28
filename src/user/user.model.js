import { Schema, model } from "mongoose";
import { L } from "../../i18n/i18n-node.js";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const UserSchema = Schema({
  email: {
    type: String,
    required: [true, L.en.DB_EMAIL_REQUIRED()],
    unique: true,
  },
  username: {
    type: String,
    required: [true, L.en.DB_USERNAME_REQUIRED],
    unique: true,
  },
  password: {
    type: String,
    required: [true, L.en.DB_PASSWORD_REQUIRED],
  },
  name: {
    type: String,
    required: [true, L.en.DB_NAME_REQUIRED],
  },
  last_name: {
    type: String,
    required: [true, L.en.DB_LASTNAME_REQUIRED],
  },
  address: {
    type: String,
    required: [true, L.en.DB_ADDRESS_REQUIRED],
  },
  DPI: {
    type: String,
    required: [true, L.en.DB_DPI_REQUIRED],
  },
  phone_number: {
    type: String,
    required: [true, L.en.DB_PHONE_NUMBER_REQUIRED],
  },
  job_name: {
    type: String,
    required: [true, L.en.DB_JOB_NAME_REQUIRED],
  },
  monthly_income: {
    type: Number,
    required: [true, L.en.DB_MONTHLY_INCOME_REQUIRED],
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

export default model("User", UserSchema);
