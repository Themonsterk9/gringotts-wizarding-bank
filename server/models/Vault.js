import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    vaultNumber: {
      type: String,
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "Galleons",
    },

    status: {
      type: String,
      enum: ["Active", "Frozen", "Closed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Vault = mongoose.model("Vault", vaultSchema);

export default Vault;