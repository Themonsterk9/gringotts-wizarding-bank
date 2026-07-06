import path from "path";
import User from "../models/User.js";
import Vault from "../models/Vault.js";

import generateToken from "../utils/generateToken.js";
import generateVaultNumber from "../utils/generateVaultNumber.js";
import sendOTPEmail from "../utils/sendOTPEmail.js";

// =========================================
// @desc Register a new wizard
// @route POST /api/auth/register
// @access Public
// =========================================
export const registerUser = async (req, res) => {
  try {
    const { wizardName, email, password } = req.body;

    if (!wizardName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if wizard already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Wizard already exists.",
      });
    }

    // Create User
    const user = await User.create({
      wizardName,
      email,
      password,
    });

    // Create Vault
    const vault = await Vault.create({
      user: user._id,
      vaultNumber: generateVaultNumber(),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        wizardName: user.wizardName,
        email: user.email,
        role: user.role,
        vault: {
          vaultNumber: vault.vaultNumber,
          balance: vault.balance,
          currency: vault.currency,
          status: vault.status,
        },
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Login Wizard (Send OTP)
// @route POST /api/auth/login
// @access Public
// =========================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.loginOTP = otp;
    user.loginOTPExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    await sendOTPEmail(
      user.email,
      user.wizardName,
      otp
    );

    return res.status(200).json({
      success: true,
      requiresOTP: true,
      email: user.email,
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Verify Login OTP
// @route POST /api/auth/verify-login-otp
// @access Public
// =========================================

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wizard not found.",
      });
    }

    if (!user.loginOTP || !user.loginOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please login again.",
      });
    }

    if (user.loginOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (user.loginOTPExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    // Clear OTP
    user.loginOTP = "";
    user.loginOTPExpiry = null;

    await user.save();

    const vault = await Vault.findOne({
      user: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        wizardName: user.wizardName,
        email: user.email,
        role: user.role,
        vault: vault
          ? {
              vaultNumber: vault.vaultNumber,
              balance: vault.balance,
              currency: vault.currency,
              status: vault.status,
            }
          : null,
      },
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Resend Login OTP
// @route POST /api/auth/resend-login-otp
// @access Public
// =========================================

export const resendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wizard not found.",
      });
    }

    // Generate new OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.loginOTP = otp;
    user.loginOTPExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    await sendOTPEmail(
      user.email,
      user.wizardName,
      otp
    );

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Get Logged-in Wizard
// @route GET /api/auth/profile
// @access Private
// =========================================
export const getProfile = async (req, res) => {
  try {
    const vault = await Vault.findOne({ user: req.user._id });

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        wizardName: req.user.wizardName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar,
        vault,
      },
    });

  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Update Logged-in Wizard Profile
// @route PUT /api/auth/profile
// @access Private
// =========================================

export const updateProfile = async (req, res) => {

  try {
    const { wizardName, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wizard not found.",
      });
    }

    // Check if email is already used by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use.",
        });
      }
    }

    user.wizardName = wizardName || user.wizardName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        wizardName: updatedUser.wizardName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Upload Profile Avatar
// @route POST /api/auth/profile/avatar
// @access Private
// =========================================

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wizard not found.",
      });
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      avatar: user.avatar,
    });

  } catch (error) {
    console.error("Upload Avatar Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Change Password
// @route PUT /api/auth/change-password
// @access Private
// =========================================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Get Notification Preferences
// @route GET /api/auth/preferences
// @access Private
// =========================================

export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "notificationPreferences"
    );

    return res.status(200).json({
      success: true,
      preferences: user.notificationPreferences,
    });

  } catch (error) {
    console.error("Get Preferences Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Update Notification Preferences
// @route PUT /api/auth/preferences
// @access Private
// =========================================

export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      preferences: user.notificationPreferences,
    });

  } catch (error) {
    console.error("Update Preferences Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};