import api from "./api";

// =========================================
// Get Logged-in User Profile
// =========================================

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};