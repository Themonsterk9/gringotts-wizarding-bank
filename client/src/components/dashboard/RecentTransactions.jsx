import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./RecentTransactions.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="recent-transactions">

      <div className="recent-header">

        <h2>📜 Recent Transactions</h2>

        <Link
          to="/transactions"
          className="view-all"
        >
          View All →
        </Link>

      </div>

      {transactions.length === 0 ? (

        <p className="empty-text">
          No recent transactions found.
        </p>

      ) : (

        <motion.div
          className="transaction-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {transactions.map((transaction) => (

            <motion.div
              key={transaction._id}
              className="transaction-card"
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.01,
              }}
            >

              <div className="transaction-left">

                <span
                  className={`transaction-icon ${transaction.type.toLowerCase()}`}
                >
                  {transaction.type === "Deposit"
                    ? "💰"
                    : transaction.type === "Withdraw"
                    ? "💸"
                    : "🔄"}
                </span>

                <div>

                  <h4>{transaction.type}</h4>

                  <p>
                    {transaction.description ||
                      "No description available"}
                  </p>

                </div>

              </div>

              <div className="transaction-right">

                <h3>

                  {Number(
                    transaction.amount
                  ).toLocaleString()}

                  {" "}

                  {transaction.currency || "Galleons"}

                </h3>

                <span
                  className={`status ${transaction.status.toLowerCase()}`}
                >
                  {transaction.status}
                </span>

                <small>
                  {new Date(
                    transaction.createdAt
                  ).toLocaleDateString()}
                </small>

              </div>

            </motion.div>

          ))}

        </motion.div>

      )}

    </div>
  );
};

export default RecentTransactions;