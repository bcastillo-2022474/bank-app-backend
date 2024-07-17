import { Schema, model } from "mongoose";
import { L } from "../../../i18n/i18n-node.js";

export const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];
export const MAX_DAILY_QUOTA = 10_000;

const AdminSchema = new Schema({
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
AdminSchema.index(
  { email: 1, tp_status: 1 },
  // this makes the index to take effect only on active currencies
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

// This ensures that each 'username' is unique only among active currencies
AdminSchema.index(
  { username: 1, tp_status: 1 },
  { unique: true, partialFilterExpression: { tp_status: ACTIVE } },
);

export default model("Admin", AdminSchema);
