import { Schema, model } from "mongoose";
const [ACTIVE, INACTIVE] = ["ACTIVE", "INACTIVE"];

const AccountSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currency: {
    type: Schema.Types.ObjectId,
    ref: "Currency",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  tp_status: {
    type: String,
    enum: [ACTIVE, INACTIVE],
    required: true,
    default: ACTIVE,
  },
});

export default model("Account", AccountSchema);
