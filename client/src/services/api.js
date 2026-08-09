import axios from "axios";

const getBaseURL = () => {
  const rawUrl = import.meta.env.VITE_API_URL;

  if (!rawUrl) {
    return "http://localhost:5001/api";
  }

  try {
    const parsed = new URL(rawUrl.trim());
    let origin = parsed.origin;
    let pathname = parsed.pathname.trim().replace(/\/+$/, "");

    if (pathname === "" || pathname === "/") {
      return `${origin}/api`;
    }

    if (pathname.endsWith("/api")) {
      return `${origin}${pathname}`;
    }

    if (pathname.includes("/api/")) {
      const apiIndex = pathname.indexOf("/api/");
      return `${origin}${pathname.substring(0, apiIndex + 4)}`;
    }

    return `${origin}/api`;
  } catch (e) {
    let cleanUrl = rawUrl.trim().replace(/\/+$/, "");
    if (!cleanUrl.endsWith("/api")) {
      cleanUrl += "/api";
    }
    return cleanUrl;
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 35000,
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

