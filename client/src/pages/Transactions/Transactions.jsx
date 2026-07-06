import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { downloadReceipt } from "../../services/receiptService";
import { FaDownload } from "react-icons/fa";

import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";
import AnimatedButton from "../../components/animation/AnimatedButton";
import AnimatedTable from "../../components/animation/AnimatedTable";
import AnimatedRow from "../../components/animation/AnimatedRow";

import { getTransactions } from "../../services/transactionService";

import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data.transactions || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (transaction) =>
          transaction.transactionId?.toLowerCase().includes(keyword) ||
          transaction.type?.toLowerCase().includes(keyword) ||
          transaction.description?.toLowerCase().includes(keyword) ||
          transaction.status?.toLowerCase().includes(keyword)
      );
    }

    if (typeFilter !== "All") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    switch (sortBy) {
      case "Newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case "Oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      case "Highest":
        result.sort((a, b) => b.amount - a.amount);
        break;

      case "Lowest":
        result.sort((a, b) => a.amount - b.amount);
        break;

      default:
        break;
    }

    return result;
  }, [transactions, search, typeFilter, statusFilter, sortBy]);

  if (loading) return <Loader />;

  const handleDownload = async (transaction) => {
    try {
      const blob = await downloadReceipt(transaction._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Receipt-${transaction.transactionId}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      toast.success("Receipt downloaded successfully.");
    } catch (error) {
      console.error("Receipt Download Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to download receipt."
      );
    }
  };

  return (
    <PageTransition>
      <Layout>
        <div className="transactions-page">
          <AnimatedCard>
            <Card title="Transaction History">
              <div className="filters">
                <input
                  type="text"
                  className="search-box"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Deposit</option>
                  <option>Withdraw</option>
                  <option>Transfer</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Success</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Highest</option>
                  <option>Lowest</option>
                </select>
              </div>

              {filteredTransactions.length === 0 ? (
                <p className="no-data">No transactions found.</p>
              ) : (
                <div className="table-container">
                  <table className="transaction-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Receipt</th>
                      </tr>
                    </thead>
                    <AnimatedTable>
                      {filteredTransactions.map((transaction) => (
                        <AnimatedRow key={transaction._id}>
                          <td>{transaction.transactionId}</td>
                          <td>{transaction.type}</td>
                          <td>
                            {Number(transaction.amount).toLocaleString()}{" "}
                            {transaction.currency || "Galleons"}
                          </td>
                          <td>
                            <span
                              className={`status ${transaction.status.toLowerCase()}`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td>{transaction.description || "-"}</td>
                          <td>
                            {new Date(transaction.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <AnimatedButton
                              className="receipt-btn"
                              onClick={() => handleDownload(transaction)}
                            >
                              <FaDownload />
                              &nbsp;Download
                            </AnimatedButton>
                          </td>
                        </AnimatedRow>
                      ))}
                    </AnimatedTable>
                  </table>
                </div>
              )}
            </Card>
          </AnimatedCard>
        </div>
      </Layout>
    </PageTransition>
  );
};

export default Transactions;