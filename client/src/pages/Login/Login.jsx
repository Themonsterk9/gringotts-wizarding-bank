import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";

import LoginArtwork from "../../components/animationHome/LoginArtwork";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await loginUser(formData);

      toast.success(data.message);

      navigate("/verify-otp", {
        state: {
          email: data.email,
        },
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>

      <div className="login-page">

        {/* Left Artwork */}

        <div className="login-left">

          <LoginArtwork />

        </div>

        {/* Right Login Form */}

        <div className="login-right">

          <AnimatedCard>

            <div className="login-card">

              <Link to="/" className="back-home">
              ← Back to Home
            </Link>

              <h1 className="login-title">
                🏦 Gringotts Wizarding Bank
              </h1>

              <p className="login-subtitle">
                Welcome back, Wizard.
              </p>

              <form
                className="login-form"
                onSubmit={handleSubmit}
              >

                <AnimatedInput
                  type="email"
                  name="email"
                  placeholder="Wizard Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <AnimatedInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <AnimatedButton
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Logging In..."
                    : "⚡ Login"}
                </AnimatedButton>

              </form>

              <p className="register-link">
                Don't have a vault?{" "}
                <Link to="/register">
                  Register
                </Link>
              </p>

            </div>

          </AnimatedCard>

        </div>

      </div>

    </PageTransition>
  );
};

export default Login;