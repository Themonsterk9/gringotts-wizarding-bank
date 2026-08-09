import { useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import AnimatedInput from "../../components/animation/AnimatedInput";

import { changePassword } from "../../services/authService";

import "./ChangePassword.css";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const data = await changePassword(formData);

      toast.success(data.message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="change-password-page">

        <Card title="🔒 Change Password">

          <form
            className="change-password-form"
            onSubmit={handleSubmit}
          >
            <AnimatedInput
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <AnimatedInput
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <AnimatedInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="change-password-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>

        </Card>

      </div>
    </Layout>
  );
};

export default ChangePassword;