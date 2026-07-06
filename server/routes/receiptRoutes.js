import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  downloadReceipt,
} from "../controllers/receiptController.js";

const router = express.Router();

router.get(
  "/:id",
  protect,
  downloadReceipt
);

export default router;