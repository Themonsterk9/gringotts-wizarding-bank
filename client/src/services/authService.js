import api from "./api";

// =========================================
// Register
// =========================================

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// =========================================
// Login (Send OTP)
// =========================================

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// =========================================
// Verify Login OTP
// =========================================

export const verifyLoginOTP = async (otpData) => {
  const response = await api.post(
    "/auth/verify-login-otp",
    otpData
  );

  return response.data;
};

// =========================================
// Resend Login OTP
// =========================================

export const resendLoginOTP = async (email) => {
  const response = await api.post(
    "/auth/resend-login-otp",
    { email }
  );

  return response.data;
};

// =========================================
// Get Profile
// =========================================

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// =========================================
// Upload Avatar
// =========================================

export const uploadAvatar = async (formData) => {
  const response = await api.post(
    "/auth/profile/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =========================================
// Change Password
// =========================================

export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/auth/change-password",
    passwordData
  );

  return response.data;
};

// =========================================
// Update Profile
// =========================================

export const updateProfile = async (profileData) => {
  const response = await api.put(
    "/auth/profile",
    profileData
  );

  return response.data;
};

// =========================================
// Get Notification Preferences
// =========================================

export const getPreferences = async () => {
  const response = await api.get("/auth/preferences");
  return response.data;
};

// =========================================
// Update Notification Preferences
// =========================================

export const updatePreferences = async (preferences) => {
  const response = await api.put(
    "/auth/preferences",
    preferences
  );

  return response.data;
};