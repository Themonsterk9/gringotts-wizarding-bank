import path from "path";
import crypto from "crypto";
import User from "../models/User.js";
import Vault from "../models/Vault.js";

import generateToken from "../utils/generateToken.js";
import generateVaultNumber from "../utils/generateVaultNumber.js";
import {
  sendRegistrationOTP,
  sendLoginOTP,
  sendPasswordResetOTP,
  sendWelcomeEmail,
} from "../services/emailService.js";

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
      if (existingUser.isVerified === false) {
        // Resend registration verification OTP for existing unverified user
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.registrationOTP = otp;
        existingUser.registrationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
        if (wizardName) existingUser.wizardName = wizardName;
        if (password) existingUser.password = password;

        await existingUser.save();
        await sendRegistrationOTP(existingUser.email, existingUser.wizardName, otp);

        return res.status(200).json({
          success: true,
          requiresVerification: true,
          email: existingUser.email,
          message: "Verification code sent to your email.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Wizard already exists.",
      });
    }

    // Generate 6-digit registration OTP (expires in 10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create User with isVerified: false
    const user = await User.create({
      wizardName,
      email,
      password,
      isVerified: false,
      registrationOTP: otp,
      registrationOTPExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Create Vault
    await Vault.create({
      user: user._id,
      vaultNumber: generateVaultNumber(),
    });

    // Send Registration OTP Email
    await sendRegistrationOTP(user.email, user.wizardName, otp);

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      email: user.email,
      message: "Registration successful. Verification code sent to your email.",
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

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

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

    // Direct unverified users to email verification
    if (user.isVerified === false && user.registrationOTP) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.registrationOTP = otp;
      user.registrationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendRegistrationOTP(user.email, user.wizardName, otp);

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: "Your account is not verified yet. A verification OTP has been sent to your email.",
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

    await sendLoginOTP(
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

    const isDbTimeout = error.message && error.message.includes("buffering timed out");
    const safeMessage = isDbTimeout
      ? "Database connection timeout. Please ensure MongoDB Community Server is reachable."
      : error.message || "Login failed. Please try again.";

    return res.status(500).json({
      success: false,
      message: safeMessage,
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

    await sendLoginOTP(
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

// =========================================
// @desc Request Password Reset OTP
// @route POST /api/auth/forgot-password
// @access Public
// =========================================
export const forgotPassword = async (req, res) => {
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
        message: "Wizard not found with this email.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.resetToken = "";
    user.resetTokenExpiry = null;

    await user.save();

    await sendPasswordResetOTP(user.email, user.wizardName, otp);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
      email: user.email,
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Verify Reset Password OTP
// @route POST /api/auth/verify-reset-otp
// @access Public
// =========================================
export const verifyResetOTP = async (req, res) => {
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

    if (!user.resetOTP || !user.resetOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "No password reset request found. Please request a new OTP.",
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    if (user.resetOTPExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // OTP verified successfully. Generate secure temporary reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetOTP = "";
    user.resetOTPExpiry = null;
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You may now reset your password.",
      resetToken,
      email: user.email,
    });

  } catch (error) {
    console.error("Verify Reset OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Resend Reset Password OTP
// @route POST /api/auth/resend-reset-otp
// @access Public
// =========================================
export const resendResetOTP = async (req, res) => {
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = new Date(Date.now() + 5 * 60 * 1000);
    user.resetToken = "";
    user.resetTokenExpiry = null;

    await user.save();

    await sendPasswordResetOTP(user.email, user.wizardName, otp);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP resent successfully.",
    });

  } catch (error) {
    console.error("Resend Reset OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Reset Password
// @route POST /api/auth/reset-password
// @access Public
// =========================================
export const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wizard not found.",
      });
    }

    if (!user.resetToken || user.resetToken !== resetToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unauthorized password reset attempt.",
      });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset session has expired. Please restart the password reset process.",
      });
    }

    // Update password (pre-save hook in User model will hash it securely with bcryptjs)
    user.password = newPassword;
    user.resetToken = "";
    user.resetTokenExpiry = null;
    user.resetOTP = "";
    user.resetOTPExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your Gringotts password has been successfully changed.",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Verify Registration OTP
// @route POST /api/auth/verify-registration-otp
// @access Public
// =========================================
export const verifyRegistrationOTP = async (req, res) => {
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

    if (user.isVerified && !user.registrationOTP) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified. Please log in.",
      });
    }

    if (!user.registrationOTP || !user.registrationOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "No verification request found. Please request a new code.",
      });
    }

    if (user.registrationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check and try again.",
      });
    }

    if (user.registrationOTPExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Mark account as verified and clear registration OTP
    user.isVerified = true;
    user.registrationOTP = "";
    user.registrationOTPExpiry = null;

    await user.save();

    // Send Welcome Email automatically after successful verification
    try {
      await sendWelcomeEmail(user.email, user.wizardName);
    } catch (welcomeErr) {
      console.error("Welcome Email Error (verification preserved):", welcomeErr);
    }

    return res.status(200).json({
      success: true,
      message: "Account Verified Successfully! Welcome to Gringotts Wizarding Bank.",
    });

  } catch (error) {
    console.error("Verify Registration OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================
// @desc Resend Registration OTP
// @route POST /api/auth/resend-registration-otp
// @access Public
// =========================================
export const resendRegistrationOTP = async (req, res) => {
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

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified. Please log in.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.registrationOTP = otp;
    user.registrationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendRegistrationOTP(user.email, user.wizardName, otp);

    return res.status(200).json({
      success: true,
      message: "Verification OTP resent successfully.",
    });

  } catch (error) {
    console.error("Resend Registration OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};