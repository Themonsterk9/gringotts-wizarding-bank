import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/authService";
import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import "./AuthCallback.css";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      navigate("/login", { replace: true });
      return;
    }

    if (!token) {
      toast.error("No authentication token provided.");
      navigate("/login", { replace: true });
      return;
    }

    // Process Token
    const completeLogin = async () => {
      try {
        localStorage.setItem("token", token);
        const profileData = await getProfile();

        if (profileData.success && profileData.user) {
          login(profileData.user, token);
          toast.success(`Welcome to Gringotts, ${profileData.user.wizardName}! 🧙‍♂️✨`);
          navigate("/dashboard", { replace: true });
        } else {
          toast.error("Failed to load user profile.");
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Auth Callback Error:", err);
        toast.error("Google authentication failed. Please try logging in again.");
        navigate("/login", { replace: true });
      }
    };

    completeLogin();
  }, [searchParams, navigate, login]);

  return (
    <PageTransition>
      <div className="auth-callback-page">
        <AnimatedCard>
          <div className="auth-callback-card">
            <div className="magic-spinner" />
            <h2 className="callback-title">🧙‍♂️ Authenticating Vault...</h2>
            <p className="callback-subtitle">Verifying your Google identity with Gringotts security.</p>
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default AuthCallback;
