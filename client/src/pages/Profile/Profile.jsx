import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedInput from "../../components/animation/AnimatedInput";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../../services/authService";

import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    wizardName: "",
    email: "",
    phone: "",
    avatar: "",
    role: "",
    vault: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setFormData({
        wizardName: data.user.wizardName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        avatar: data.user.avatar || "",
        role: data.user.role || "",
        vault: data.user.vault,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("avatar", file);

    try {
      const data = await uploadAvatar(uploadData);

      toast.success(data.message);

      fetchProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Avatar upload failed."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const data = await updateProfile({
        wizardName: formData.wizardName,
        email: formData.email,
        phone: formData.phone,
      });

      toast.success(data.message);

      fetchProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PageTransition>
      <Layout>
        <div className="profile-page">

          <AnimatedCard>

            <Card title="🧙 Wizard Profile">

              <div className="profile-avatar">

                {formData.avatar ? (
                  <img
                    src={`http://localhost:5001${formData.avatar}`}
                    alt="Avatar"
                    className="avatar-image"
                  />
                ) : (
                  formData.wizardName.charAt(0).toUpperCase()
                )}

              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
              />

              <form
                className="profile-form"
                onSubmit={handleSubmit}
              >

                <div className="profile-item">

                  <label>Wizard Name</label>

                  <AnimatedInput
                    type="text"
                    name="wizardName"
                    value={formData.wizardName}
                    onChange={handleChange}
                  />

                </div>

                <div className="profile-item">

                  <label>Email</label>

                  <AnimatedInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

                <div className="profile-item">

                  <label>Phone</label>

                  <AnimatedInput
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

                <div className="profile-item">

                  <label>Role</label>

                  <AnimatedInput
                    type="text"
                    name="role"
                    value={formData.role}
                    disabled
                  />

                </div>

                <div className="profile-item">

                  <label>Vault Number</label>

                  <AnimatedInput
                    type="text"
                    name="vaultNumber"
                    value={formData.vault?.vaultNumber || ""}
                    disabled
                  />

                </div>

                <div className="profile-item">

                  <label>Balance</label>

                  <AnimatedInput
                    type="text"
                    name="balance"
                    value={`${Number(
                      formData.vault?.balance || 0
                    ).toLocaleString()} ${
                      formData.vault?.currency || ""
                    }`}
                    disabled
                  />

                </div>

                <AnimatedButton
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "✨ Save Changes"}
                </AnimatedButton>

              </form>

            </Card>

          </AnimatedCard>

        </div>
      </Layout>
    </PageTransition>
  );
};

export default Profile;