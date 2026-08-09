import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { forgotPassword } from "../../services/authService";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";

import LoginArtwork from "../../components/animationHome/LoginArtwork";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid wizard email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await forgotPassword(email);

      toast.success(data.message || "Password reset OTP sent to your email.");

      navigate("/verify-otp", {
        state: {
          email: data.email || email,
          purpose: "reset",
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to process forgot password request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="forgot-password-page">
        {/* Left Artwork */}
        <div className="forgot-password-left">
          <LoginArtwork />
        </div>

        {/* Right Form Card */}
        <div className="forgot-password-right">
          <AnimatedCard>
            <div className="forgot-password-card">
              <Link to="/login" className="back-home">
                ← Back to Login
              </Link>

              <h1 className="forgot-password-title">
                🏦 Gringotts Wizarding Bank
              </h1>

              <h2 className="forgot-password-heading">
                Reset Vault Password
              </h2>

              <p className="forgot-password-subtitle">
                Enter your registered wizard email address below to receive a secure 6-digit OTP code.
              </p>

              <form
                className="forgot-password-form"
                onSubmit={handleSubmit}
              >
                <AnimatedInput
                  type="email"
                  name="email"
                  placeholder="Wizard Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <AnimatedButton
                  type="submit"
                  className="forgot-password-btn"
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "⚡ Send Reset OTP"}
                </AnimatedButton>
              </form>

              <p className="remember-pass-link">
                Remember your password?{" "}
                <Link to="/login">
                  Login here
                </Link>
              </p>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
