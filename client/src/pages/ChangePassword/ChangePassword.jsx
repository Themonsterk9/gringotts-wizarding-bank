import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";

import { changePassword } from "../../services/authService";

import "./ChangePassword.css";

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

            <div className="password-group">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="password-group">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="password-group">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
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