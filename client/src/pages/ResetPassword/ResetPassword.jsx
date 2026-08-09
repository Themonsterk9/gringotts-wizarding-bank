import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { resetPassword } from "../../services/authService";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";

import LoginArtwork from "../../components/animationHome/LoginArtwork";

import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!email || !resetToken) {
      toast.error("Invalid password reset session. Please request a new OTP.");
      navigate("/forgot-password");
    }
  }, [email, resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        email,
        resetToken,
        newPassword,
      });

      toast.success(data.message || "Password changed successfully.");
      setResetSuccess(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="reset-password-page">
        {/* Left Artwork */}
        <div className="reset-password-left">
          <LoginArtwork />
        </div>

        {/* Right Form Card */}
        <div className="reset-password-right">
          <AnimatedCard>
            <div className="reset-password-card">
              <Link to="/login" className="back-home">
                ← Back to Login
              </Link>

              <h1 className="reset-password-title">
                🏦 Gringotts Wizarding Bank
              </h1>

              {resetSuccess ? (
                <div className="reset-success-container">
                  <div className="success-icon">✨</div>
                  <h2 className="reset-success-heading">
                    Password Reset Complete!
                  </h2>
                  <p className="reset-success-message">
                    Your Gringotts password has been successfully changed.
                  </p>
                  <AnimatedButton
                    className="reset-login-btn"
                    onClick={() => navigate("/login")}
                  >
                    ⚡ Return to Login
                  </AnimatedButton>
                </div>
              ) : (
                <>
                  <h2 className="reset-password-heading">
                    Set New Vault Password
                  </h2>

                  <p className="reset-password-subtitle">
                    Create a strong new password for account <strong>{email}</strong>
                  </p>

                  <form
                    className="reset-password-form"
                    onSubmit={handleSubmit}
                  >
                    <AnimatedInput
                      type="password"
                      name="newPassword"
                      placeholder="New Password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />

                    <AnimatedInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />

                    <AnimatedButton
                      type="submit"
                      className="reset-password-btn"
                      disabled={loading}
                    >
                      {loading ? "Resetting Password..." : "🔒 Reset Password"}
                    </AnimatedButton>
                  </form>

                  <p className="remember-pass-link">
                    Need to start over?{" "}
                    <Link to="/forgot-password">
                      Request new OTP
                    </Link>
                  </p>
                </>
              )}
            </div>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
