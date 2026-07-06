import { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";
import Loader from "../../components/common/Loader";

import BalanceCard from "../../components/dashboard/BalanceCard";
import StatsCard from "../../components/dashboard/StatsCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import TransactionChart from "../../components/dashboard/TransactionChart";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedCard from "../../components/animation/AnimatedCard";

import { getDashboard } from "../../services/dashboardService";

import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data.dashboard || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  if (!dashboard) {
    return (
      <PageTransition>
        <Layout>
          <p>Unable to load dashboard.</p>
        </Layout>
      </PageTransition>
    );
  }

  const statistics = dashboard.statistics || {};
  const monthlyData = dashboard.charts?.monthlyData || [];
  const recentTransactions = dashboard.recentTransactions || [];
  const wizardName = dashboard.wizard?.wizardName || "Wizard";

  return (
    <PageTransition>

      <Layout>

        <div className="dashboard">

          <div className="dashboard-header">
            <h1>Welcome, {wizardName} 🧙</h1>

            <p>
              Here is your magical vault activity at a glance.
            </p>
          </div>

          <div className="dashboard-grid">

            <AnimatedCard>
              <BalanceCard vault={dashboard.vault} />
            </AnimatedCard>

            <AnimatedCard>
              <StatsCard
                title="Total Deposits"
                value={statistics.totalDeposits || 0}
                icon="📈"
                color="#22c55e"
              />
            </AnimatedCard>

            <AnimatedCard>
              <StatsCard
                title="Total Withdrawals"
                value={statistics.totalWithdrawals || 0}
                icon="📉"
                color="#ef4444"
              />
            </AnimatedCard>

          </div>

          <AnimatedCard>
            <TransactionChart monthlyData={monthlyData} />
          </AnimatedCard>

          <AnimatedCard>
            <QuickActions />
          </AnimatedCard>

          <AnimatedCard>
            <RecentTransactions
              transactions={recentTransactions}
            />
          </AnimatedCard>

        </div>

      </Layout>

    </PageTransition>
  );
};

export default Dashboard;