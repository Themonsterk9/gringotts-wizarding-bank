import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  registerUser,
  loginUser,
  verifyLoginOTP,
  resendLoginOTP,
  forgotPassword,
  verifyResetOTP,
  resendResetOTP,
  resetPassword,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getPreferences,
  updatePreferences,
  googleVerify,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetOTPValidation,
  resetPasswordValidation,
  verifyRegistrationOTPValidation,
  resendRegistrationOTPValidation,
  validate,
} from "../validators/authValidator.js";

const router = express.Router();

// Google OAuth Verification Route
router.post("/google/verify", googleVerify);


// Register
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
);

// Verify Registration OTP
router.post(
  "/verify-registration-otp",
  verifyRegistrationOTPValidation,
  validate,
  verifyRegistrationOTP
);

// Resend Registration OTP
router.post(
  "/resend-registration-otp",
  resendRegistrationOTPValidation,
  validate,
  resendRegistrationOTP
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);

// Verify Login OTP
router.post(
  "/verify-login-otp",
  verifyLoginOTP
);

// Resend Login OTP
router.post(
  "/resend-login-otp",
  resendLoginOTP
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword
);

// Verify Reset OTP
router.post(
  "/verify-reset-otp",
  verifyResetOTPValidation,
  validate,
  verifyResetOTP
);

// Resend Reset OTP
router.post(
  "/resend-reset-otp",
  forgotPasswordValidation,
  validate,
  resendResetOTP
);

// Reset Password
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword
);

// Get Logged-in Wizard Profile
router.get(
  "/profile",
   protect, 
   getProfile);

router.put(
  "/profile",
  protect,
  updateProfile
);

// Upload Avatar
router.post(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

// Notification Preferences
router.get(
  "/preferences",
  protect,
  getPreferences
);

router.put(
  "/preferences",
  protect,
  updatePreferences
);

export default router;