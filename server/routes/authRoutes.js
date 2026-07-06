import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  registerUser,
  loginUser,
  verifyLoginOTP,
  resendLoginOTP,
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getPreferences,
  updatePreferences,
} from "../controllers/authController.js";

import {
  registerValidation,
  loginValidation,
  validate,
} from "../validators/authValidator.js";

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  registerUser
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