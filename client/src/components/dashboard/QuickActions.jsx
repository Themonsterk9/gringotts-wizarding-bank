import { useNavigate } from "react-router-dom";

import "./QuickActions.css";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Deposit",
      icon: "💰",
      path: "/deposit",
    },
    {
      title: "Withdraw",
      icon: "💸",
      path: "/withdraw",
    },
    {
      title: "Transfer",
      icon: "🔄",
      path: "/transfer",
    },
    {
      title: "Transactions",
      icon: "📜",
      path: "/transactions",
    },
    {
      title: "Profile",
      icon: "👤",
      path: "/profile",
    },
  ];

  return (
    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="actions-grid">

        {actions.map((action) => (
          <button
            key={action.title}
            className="action-card"
            onClick={() => navigate(action.path)}
          >
            <span className="action-icon">
              {action.icon}
            </span>

            <span className="action-title">
              {action.title}
            </span>
          </button>
        ))}

      </div>

    </div>
  );
};

export default QuickActions;