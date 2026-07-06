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

// Validate Request
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};