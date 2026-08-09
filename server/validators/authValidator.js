import { body, validationResult } from "express-validator";

// Register Validation
export const registerValidation = [
  body("wizardName")
    .trim()
    .notEmpty()
    .withMessage("Wizard name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Wizard name must be between 3 and 30 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Login Validation
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Verify Registration OTP Validation
export const verifyRegistrationOTPValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

// Resend Registration OTP Validation
export const resendRegistrationOTPValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
];

// Forgot Password Validation
export const forgotPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
];

// Verify Reset OTP Validation
export const verifyResetOTPValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

// Reset Password Validation
export const resetPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("resetToken")
    .trim()
    .notEmpty()
    .withMessage("Reset token is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validate Request
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      message: errors.array()[0]?.msg || "Validation error",
    });
  }

  next();
};