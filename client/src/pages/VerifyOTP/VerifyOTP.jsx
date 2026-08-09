import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";

import { useAuth } from "../../context/AuthContext";

import {
  verifyLoginOTP,
  resendLoginOTP,
  verifyResetOTP,
  resendResetOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
} from "../../services/authService";

import "./VerifyOTP.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "login";
  const isReset = purpose === "reset";
  const isRegister = purpose === "register";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [registrationVerified, setRegistrationVerified] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOtp(updatedOTP);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updatedOTP = [...otp];

    pasted.split("").forEach((digit, index) => {
      updatedOTP[index] = digit;
    });

    setOtp(updatedOTP);

    const lastIndex = Math.min(
      pasted.length - 1,
      5
    );

    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.error("Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const data = await verifyRegistrationOTP({
          email,
          otp: fullOtp,
        });

        toast.success(data.message);
        setRegistrationVerified(true);
      } else if (isReset) {
        const data = await verifyResetOTP({
          email,
          otp: fullOtp,
        });

        toast.success(data.message);

        navigate("/reset-password", {
          state: {
            email: data.email,
            resetToken: data.resetToken,
          },
        });
      } else {
        const data = await verifyLoginOTP({
          email,
          otp: fullOtp,
        });

        login(data.user, data.token);

        toast.success(data.message);

        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      let data;
      if (isRegister) {
        data = await resendRegistrationOTP(email);
      } else if (isReset) {
        data = await resendResetOTP(email);
      } else {
        data = await resendLoginOTP(email);
      }

      toast.success(data.message);

      setSeconds(30);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP."
      );
    }
  };

  return (
    <PageTransition>
      <div className="otp-page">
        <AnimatedCard className="otp-card">
          {registrationVerified ? (
            <div className="otp-success-container" style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🏦</div>
              <h2 style={{ color: "#ffd700", fontSize: "1.4rem", margin: "0 0 10px 0" }}>
                Account Verified Successfully! 🏦
              </h2>
              <p style={{ color: "#e5e7eb", fontSize: "0.98rem", lineHeight: "1.6", marginBottom: "25px" }}>
                Welcome to Gringotts Wizarding Bank. Your account has been activated and a welcome email has been sent to your inbox.
              </p>
              <AnimatedButton
                className="otp-btn"
                onClick={() => navigate("/login")}
              >
                ⚡ Continue to Login
              </AnimatedButton>
            </div>
          ) : (
            <>
              {isRegister ? (
                <Link to="/register" className="back-home">
                  ← Back to Registration
                </Link>
              ) : isReset ? (
                <Link to="/forgot-password" className="back-home">
                  ← Back to Forgot Password
                </Link>
              ) : (
                <Link to="/login" className="back-home">
                  ← Back to Login
                </Link>
              )}

              <h1 className="otp-title">
                {isRegister
                  ? "🔐 Verify Your Gringotts Account"
                  : isReset
                  ? "🔐 Verify Reset OTP"
                  : "🔐 Verify Login OTP"}
              </h1>

              <p className="otp-subtitle">
                {isRegister
                  ? "We've sent a 6-digit verification code to"
                  : "A 6-digit OTP has been sent to"}
              </p>

              <p className="otp-email">
                {email}
              </p>

              <form
                className="otp-form"
                onSubmit={handleVerify}
              >
                <div
                  className="otp-inputs"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleChange(index, e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(index, e)
                      }
                      className="otp-box"
                    />
                  ))}
                </div>

                <AnimatedButton
                  type="submit"
                  className="otp-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Verifying..."
                    : isRegister
                    ? "✨ Verify Account"
                    : "✨ Verify OTP"}
                </AnimatedButton>
              </form>

              {seconds > 0 ? (
                <p className="otp-timer">
                  Resend code in {seconds}s
                </p>
              ) : (
                <button
                  className="resend-btn"
                  onClick={handleResend}
                >
                  Resend Code
                </button>
              )}
            </>
          )}
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default VerifyOTP;