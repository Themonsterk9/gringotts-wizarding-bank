import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getVault,
  depositMoney,
  withdrawMoney,
  transferMoney,
  lookupVault,
} from "../controllers/vaultController.js";

const router = express.Router();

// Get Vault
router.get("/", protect, getVault);

// Deposit
router.post("/deposit", protect, depositMoney);

// Withdraw
router.post("/withdraw", protect, withdrawMoney);

// Lookup Vault
router.get("/lookup/:vaultNumber", protect, lookupVault);

// Transfer
router.post("/transfer", protect, transferMoney);

export default router;