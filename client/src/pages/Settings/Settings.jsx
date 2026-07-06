import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import { useTheme } from "../../context/ThemeContext";

import {
  getPreferences,
  updatePreferences,
} from "../../services/authService";

import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useTheme();

  const [preferences, setPreferences] = useState({
    transactionAlerts: true,
    depositAlerts: true,
    withdrawalAlerts: true,
    transferAlerts: true,
    emailNotifications: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await getPreferences();

      setPreferences(data.preferences);
    } catch {
      toast.error("Failed to load preferences.");
    }
  };

  const handleToggle = async (key) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(updated);

    try {
      await updatePreferences(updated);

      toast.success("Preferences updated.");
    } catch {
      toast.error("Update failed.");

      setPreferences(preferences);
    }
  };

  return (
    <PageTransition>

      <Layout>

        <div className="settings-page">

          <AnimatedCard>

            <Card title="⚙️ Account Settings">

              <div className="settings-group">

                {/* Transaction Alerts */}

                <div className="setting-item">

                  <div>

                    <h3>Transaction Alerts</h3>

                    <p>
                      Receive alerts for every transaction.
                    </p>

                  </div>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={
                        preferences.transactionAlerts
                      }
                      onChange={() =>
                        handleToggle(
                          "transactionAlerts"
                        )
                      }
                    />

                    <span className="slider"></span>

                  </label>

                </div>

                {/* Deposit */}

                <div className="setting-item">

                  <div>

                    <h3>Deposit Alerts</h3>

                    <p>
                      Notify when money is deposited.
                    </p>

                  </div>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={
                        preferences.depositAlerts
                      }
                      onChange={() =>
                        handleToggle(
                          "depositAlerts"
                        )
                      }
                    />

                    <span className="slider"></span>

                  </label>

                </div>

                {/* Withdraw */}

                <div className="setting-item">

                  <div>

                    <h3>Withdrawal Alerts</h3>

                    <p>
                      Notify when money is withdrawn.
                    </p>

                  </div>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={
                        preferences.withdrawalAlerts
                      }
                      onChange={() =>
                        handleToggle(
                          "withdrawalAlerts"
                        )
                      }
                    />

                    <span className="slider"></span>

                  </label>

                </div>

                {/* Transfer */}

                <div className="setting-item">

                  <div>

                    <h3>Transfer Alerts</h3>

                    <p>
                      Notify when transfers occur.
                    </p>

                  </div>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={
                        preferences.transferAlerts
                      }
                      onChange={() =>
                        handleToggle(
                          "transferAlerts"
                        )
                      }
                    />

                    <span className="slider"></span>

                  </label>

                </div>

                {/* Email */}

                <div className="setting-item">

                  <div>

                    <h3>Email Notifications</h3>

                    <p>
                      Receive important emails.
                    </p>

                  </div>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={
                        preferences.emailNotifications
                      }
                      onChange={() =>
                        handleToggle(
                          "emailNotifications"
                        )
                      }
                    />

                    <span className="slider"></span>

                  </label>

                </div>

                {/* Dark Mode */}

                <div className="setting-item">

                  <div>

                    <h3>Dark Mode</h3>

                    <p>
                      Enable the dark wizard theme.
                    </p>

                  </div>

                  <label className="switch">

                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={toggleDarkMode}
                    />

                    <span className="slider"></span>

                  </label>

                </div>

                {/* Password */}

                <div className="setting-item">

                  <div>

                    <h3>Change Password</h3>

                    <p>
                      Update your account password.
                    </p>

                  </div>

                  <Link to="/change-password">

                    <button className="settings-btn">

                      Change Password

                    </button>

                  </Link>

                </div>

                {/* Security */}

<div className="setting-item">

  <div>

    <h3>🔐 Account Security</h3>

    <p>
      Manage your password, devices and account protection.
    </p>

  </div>

  <button
    className="settings-btn secondary"
    onClick={() => navigate("/security")}
  >
    Manage Security
  </button>

</div>

              </div>

            </Card>

          </AnimatedCard>

        </div>

      </Layout>

    </PageTransition>
  );
};

export default Settings;