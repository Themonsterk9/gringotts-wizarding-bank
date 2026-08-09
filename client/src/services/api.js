import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// =========================================
// Attach JWT Token Automatically
// =========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === "get") {
      config.params = {
        ...config.params,
        _: Date.now(),
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================================
// Handle Unauthorized Responses
// =========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Avoid redirect loop if on auth/reset flow pages
      const publicAuthPages = ["/login", "/forgot-password", "/reset-password", "/verify-otp"];
      if (!publicAuthPages.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

