import Layout from "../../components/layout/Layout";
import "./Security.css";

const Security = () => {
  return (
    <Layout>

      <div className="security-page">

        <h1>🔐 Security Center</h1>

        <p className="security-subtitle">
          Protect your Gringotts Vault
        </p>

        {/* Password */}

        <div className="security-card">

          <div>

            <h2>Password</h2>

            <p>
              Update your account password.
            </p>

          </div>

          <button>
            Change Password
          </button>

        </div>

        {/* Login History */}

        <div className="security-card">

          <div>

            <h2>Login History</h2>

            <p>
              View your recent logins.
            </p>

          </div>

          <button disabled>
            Coming Soon
          </button>

        </div>

        {/* Trusted Devices */}

        <div className="security-card">

          <div>

            <h2>Trusted Devices</h2>

            <p>
              Manage devices that access your vault.
            </p>

          </div>

          <button disabled>
            Coming Soon
          </button>

        </div>

        {/* Active Sessions */}

        <div className="security-card">

          <div>

            <h2>Active Sessions</h2>

            <p>
              See where your account is currently signed in.
            </p>

          </div>

          <button disabled>
            Coming Soon
          </button>

        </div>

        {/* Two Factor */}

        <div className="security-card">

          <div>

            <h2>Two-Factor Authentication</h2>

            <p>
              Extra protection for your Gringotts account.
            </p>

          </div>

          <button disabled>
            Coming Soon
          </button>

        </div>

      </div>

    </Layout>
  );
};

export default Security;