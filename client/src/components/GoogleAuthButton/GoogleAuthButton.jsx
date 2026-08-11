import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/authService";
import "./GoogleAuthButton.css";

const GoogleAuthButton = ({ text = "Continue with Google", disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthCodeResponse = async (response) => {
    if (!response.code) {
      toast.error("Authorization code missing from Google response.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/google/verify", {
        code: response.code,
      });

      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        const profileData = await getProfile();

        if (profileData.success && profileData.user) {
          login(profileData.user, res.data.token);
          toast.success(`Welcome to Gringotts, ${profileData.user.wizardName}! 🧙‍♂️✨`);
          navigate("/dashboard", { replace: true });
        } else {
          toast.error("Failed to load user profile.");
        }
      } else {
        toast.error(res.data.message || "Google authentication failed.");
      }
    } catch (err) {
      console.error("Google verification error:", err);
      toast.error(err.response?.data?.message || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (loading || disabled) return;

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      toast.error("Google Sign-In is initializing. Please wait a moment and try again.");
      return;
    }

    setLoading(true);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "215759334057-r484e90uo3hnscqiefp9c5j8vd6bhbad.apps.googleusercontent.com";

    try {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: handleAuthCodeResponse,
        error_callback: (err) => {
          console.error("Google popup error:", err);
          toast.error("Google authentication popup was closed or encountered an error.");
          setLoading(false);
        },
      });

      client.requestCode();
    } catch (err) {
      console.error("Failed to initialize Google login popup:", err);
      toast.error("Failed to initialize Google login popup.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="google-auth-btn"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={text}
    >
      {loading ? (
        <span className="google-btn-spinner" aria-hidden="true" />
      ) : (
        <svg
          className="google-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span>{loading ? "Connecting to Google..." : text}</span>
    </button>
  );
};

export default GoogleAuthButton;
