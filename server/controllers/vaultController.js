import Vault from "../models/Vault.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

import generateTransactionId from "../utils/generateTransactionId.js";

// =========================================
// @desc Get Wizard Vault
// @route GET /api/vault
// @access Private
// =========================================

export const getVault = async (req, res) => {
  try {
    const vault = await Vault.findOne({ user: req.user._id });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    return res.status(200).json({
      success: true,
      vault,
    });

  } catch (error) {
    console.error("Vault Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Deposit Money
// @route POST /api/vault/deposit
// @access Private
// =========================================

export const depositMoney = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount.",
      });
    }

    const vault = await Vault.findOne({
      user: req.user._id,
    });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    vault.balance += Number(amount);

    await vault.save();

    await Transaction.create({
      transactionId: generateTransactionId(),
      user: req.user._id,
      type: "Deposit",
      direction: "Credit",
      amount: Number(amount),
      receiverVault: vault.vaultNumber,
      description: description || "Deposit",
      status: "Success",
    });

    return res.status(200).json({
      success: true,
      message: "Deposit successful.",
      vault,
    });

  } catch (error) {
    console.error("Vault Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Withdraw Money
// @route POST /api/vault/withdraw
// @access Private
// =========================================

export const withdrawMoney = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount.",
      });
    }

    const vault = await Vault.findOne({
      user: req.user._id,
    });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    if (vault.balance < Number(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    vault.balance -= Number(amount);

    await vault.save();

    await Transaction.create({
      transactionId: generateTransactionId(),
      user: req.user._id,
      type: "Withdraw",
      direction: "Debit",
      amount: Number(amount),
      senderVault: vault.vaultNumber,
      description: description || "Withdrawal",
      status: "Success",
    });

    return res.status(200).json({
      success: true,
      message: "Withdrawal successful.",
      vault,
    });

  } catch (error) {
    console.error("Vault Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Transfer Money
// @route POST /api/vault/transfer
// @access Private
// =========================================

export const transferMoney = async (req, res) => {
  try {
    const { receiverVaultNumber, amount, description } = req.body;

    // Validate input
    if (!receiverVaultNumber || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Receiver vault number and a valid amount are required.",
      });
    }

    // Sender Vault
    const senderVault = await Vault.findOne({
      user: req.user._id,
    });

    if (!senderVault) {
      return res.status(404).json({
        success: false,
        message: "Sender vault not found.",
      });
    }

    // Prevent self-transfer
    if (senderVault.vaultNumber === receiverVaultNumber) {
      return res.status(400).json({
        success: false,
        message: "You cannot transfer money to your own vault.",
      });
    }

    // Receiver Vault
    const receiverVault = await Vault.findOne({
      vaultNumber: receiverVaultNumber,
    });

    if (!receiverVault) {
      return res.status(404).json({
        success: false,
        message: "Receiver vault not found.",
      });
    }

    // Check balance
    if (senderVault.balance < Number(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    // Update balances
    senderVault.balance -= Number(amount);
    receiverVault.balance += Number(amount);

    await senderVault.save();
    await receiverVault.save();

    // Sender transaction
    await Transaction.create({
      transactionId: generateTransactionId(),
      user: req.user._id,
      type: "Transfer",
      direction: "Debit",
      amount: Number(amount),
      senderVault: senderVault.vaultNumber,
      receiverVault: receiverVault.vaultNumber,
      description: description || "Vault Transfer",
      status: "Success",
    });

    // Receiver transaction
    await Transaction.create({
      transactionId: generateTransactionId(),
      user: receiverVault.user,
      type: "Transfer",
      direction: "Credit",
      amount: Number(amount),
      senderVault: senderVault.vaultNumber,
      receiverVault: receiverVault.vaultNumber,
      description: description || "Vault Transfer",
      status: "Success",
    });

    return res.status(200).json({
      success: true,
      message: "Transfer completed successfully.",
      senderBalance: senderVault.balance,
      receiverVault: receiverVault.vaultNumber,
    });

  } catch (error) {
    console.error("Vault Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Lookup Vault
// @route GET /api/vault/lookup/:vaultNumber
// @access Private
// =========================================

export const lookupVault = async (req, res) => {
  try {
    const { vaultNumber } = req.params;

    const vault = await Vault.findOne({
      vaultNumber,
    }).populate("user", "wizardName email role");

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    return res.status(200).json({
      success: true,
      recipient: {
        wizardName: vault.user.wizardName,
        email: vault.user.email,
        role: vault.user.role,
        vaultNumber: vault.vaultNumber,
        status: vault.status,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



