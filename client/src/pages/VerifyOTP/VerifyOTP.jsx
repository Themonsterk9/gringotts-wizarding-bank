import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";

import { useAuth } from "../../context/AuthContext";

import {
  verifyLoginOTP,
  resendLoginOTP,
} from "../../services/authService";

import "./VerifyOTP.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(30);

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

    setLoading(true);

    try {
      const data = await verifyLoginOTP({
  email,
  otp: otp.join(""),
});

      login(data.user, data.token);

      toast.success(data.message);

      navigate("/dashboard");

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
      const data = await resendLoginOTP(email);

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

          <h1 className="otp-title">
            🔐 Verify Login OTP
          </h1>

          <p className="otp-subtitle">
            A 6-digit OTP has been sent to
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
                : "✨ Verify OTP"}
            </AnimatedButton>

          </form>

          {seconds > 0 ? (
            <p className="otp-timer">
              Resend OTP in {seconds}s
            </p>
          ) : (
            <button
              className="resend-btn"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}

        </AnimatedCard>

      </div>

    </PageTransition>
  );
};

export default VerifyOTP;