import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Deposit", "Withdraw", "Transfer"],
      required: true,
    },

    direction: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    senderVault: {
      type: String,
      default: null,
    },

    receiverVault: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Success", "Pending", "Failed"],
      default: "Success",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;