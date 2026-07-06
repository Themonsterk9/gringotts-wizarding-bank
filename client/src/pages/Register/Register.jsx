import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    wizardName: "",
    email: "",
    password: "",
  });

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
      const data = await registerUser(formData);

      login(data.user, data.token);

      toast.success(data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="register-page">
        <AnimatedCard className="register-card">
          <Link to="/" className="back-home">
           ← Back to Home
            </Link>

          <h1 className="register-title">
            🏦 Gringotts Wizarding Bank
          </h1>

          <p className="register-subtitle">
            Create your magical vault today.
          </p>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <AnimatedInput
              type="text"
              name="wizardName"
              placeholder="Wizard Name"
              value={formData.wizardName}
              onChange={handleChange}
              required
            />

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
              className="register-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Vault..."
                : "✨ Create Vault"}
            </AnimatedButton>
          </form>

          <p className="login-link">
            Already have a vault?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
};

export default Register;