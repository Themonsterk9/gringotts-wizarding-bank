import Card from "../common/Card";
import AnimatedCounter from "../animation/AnimatedCounter";

import "./BalanceCard.css";

const BalanceCard = ({ vault }) => {
  if (!vault) {
    return (
      <Card title="💰 Vault Balance">
        <p>Vault not found.</p>
      </Card>
    );
  }

  return (
    <Card title="💰 Vault Balance">
      <div className="balance-card">

        <div className="balance-header">

          <h2 className="balance-amount">
            <AnimatedCounter
              end={vault.balance}
              duration={2.5}
            />
          </h2>

          <span className="currency">
            {vault.currency}
          </span>

        </div>

        <div className="vault-info">

          <p>
            <strong>Vault Number:</strong>
            <br />
            {vault.vaultNumber}
          </p>

          <p>
            <strong>Status:</strong>
            <br />
            <span
              className={`vault-status ${vault.status.toLowerCase()}`}
            >
              {vault.status}
            </span>
          </p>

        </div>

      </div>
    </Card>
  );
};

export default BalanceCard;