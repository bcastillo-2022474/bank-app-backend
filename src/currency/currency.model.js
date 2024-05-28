import { Schema, model } from "mongoose";

const currencySchema = new Schema({
    symbol: {
        type: String,
        unique: true,
        required: [true, "The symbol is required"],
    },
    name: {
        type: String,
        unique: true,
        required: [true, "The name is required"],
    },
    key: {
        type: String,
        unique: true,
        required: [true, "The key is required"]
    },
    tp_status: {
        type: String,
        required: [true, "The status is required"],
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: [true, "The `created_at` is required"],
    },
      updated_at: {
        type: Date,
        default: Date.now,
    },
});

const currencyModel = model("Currency", currencySchema);

export default currencyModel;