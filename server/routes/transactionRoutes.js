import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getTransactions,
  getTransactionById,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", protect, getTransactions);
router.get("/:id", protect, getTransactionById);

export default router;