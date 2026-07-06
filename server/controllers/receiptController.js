import PDFDocument from "pdfkit";

import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Vault from "../models/Vault.js";

import { generateReceipt } from "../utils/receiptTemplate.js";

// =========================================
// @desc Download Receipt
// @route GET /api/receipt/:id
// @access Private
// =========================================

export const downloadReceipt = async (req, res) => {
  try {
    // =========================================
    // Find Transaction
    // =========================================

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    // =========================================
    // Get User
    // =========================================

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =========================================
    // Get Vault
    // =========================================

    const vault = await Vault.findOne({
      user: req.user._id,
    });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    // =========================================
    // Create PDF
    // =========================================

    const doc = new PDFDocument({
      size: "A4",
      margin: 25,
      bufferPages: true,
    });

    // =========================================
    // Response Headers
    // =========================================

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${transaction.transactionId}.pdf`
    );

    // =========================================
    // Pipe PDF
    // =========================================

    doc.pipe(res);

    // =========================================
    // Generate Premium Receipt
    // =========================================

    await generateReceipt(
      doc,
      transaction,
      user,
      vault
    );

    // =========================================
    // Finish PDF
    // =========================================

    doc.end();

  } catch (error) {
    console.error("Receipt Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};