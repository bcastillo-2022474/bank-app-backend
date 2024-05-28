import mongoose from "mongoose";

const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "The username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  last_name: {
    type: String,
    required: [true, "The the last name is required"],
  },
  address: {
    type: String,
    required: [true, "The the Address is required"],
  },
  DPI: {
    type: String,
    required: [true, "The the DPI  is required"],
  },
  phone_number: {
    type: String,
    required: [true, "The the DPI  is required"],
  },
  job_name: {
    type: String,
    required: [true, "The the Job Name is required"],
  },
  monthly_income: {
    type: Number,
    required: [true, "The the Monthly Income is required"],
  },
  currency_income: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
  },
  main_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Acount",
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model("User", UserSchema);
