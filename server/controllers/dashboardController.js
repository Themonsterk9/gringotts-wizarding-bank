import Vault from "../models/Vault.js";
import Transaction from "../models/Transaction.js";

// =========================================
// @desc Dashboard Data
// @route GET /api/dashboard
// @access Private
// =========================================

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const vault = await Vault.findOne({
      user: userId,
    });

    const recentTransactions = await Transaction.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const transactions = await Transaction.find({
      user: userId,
      status: "Success",
    });

    const totalTransactions = transactions.length;

    const totalDeposits = transactions
      .filter((transaction) => transaction.type === "Deposit")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const totalWithdrawals = transactions
      .filter((transaction) => transaction.type === "Withdraw")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const highestDeposit = transactions
      .filter((transaction) => transaction.type === "Deposit")
      .reduce((max, transaction) => Math.max(max, Number(transaction.amount || 0)), 0);

    const highestWithdrawal = transactions
      .filter((transaction) => transaction.type === "Withdraw")
      .reduce((max, transaction) => Math.max(max, Number(transaction.amount || 0)), 0);

    // =========================================
    // Last 6 Months Analytics
    // =========================================

    const now = new Date();
    const monthBuckets = [];

    for (let i = 5; i >= 0; i--) {
      const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

      monthBuckets.push({
        year: bucketDate.getFullYear(),
        monthNumber: bucketDate.getMonth() + 1,
        month: bucketDate.toLocaleString("en-US", { month: "short" }),
        deposits: 0,
        withdrawals: 0,
      });
    }

    const firstBucket = monthBuckets[0];
    const startDate = new Date(firstBucket.year, firstBucket.monthNumber - 1, 1);

    const monthlyTotals = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          status: "Success",
          type: { $in: ["Deposit", "Withdraw"] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const bucketMap = new Map(
      monthBuckets.map((bucket) => [
        `${bucket.year}-${bucket.monthNumber}`,
        bucket,
      ])
    );

    monthlyTotals.forEach((item) => {
      const bucket = bucketMap.get(`${item._id.year}-${item._id.month}`);

      if (!bucket) {
        return;
      }

      const total = Number(item.total || 0);

      if (item._id.type === "Deposit") {
        bucket.deposits = total;
      }

      if (item._id.type === "Withdraw") {
        bucket.withdrawals = total;
      }
    });

    const monthlyData = monthBuckets.map(({ month, deposits, withdrawals }) => ({
      month,
      deposits,
      withdrawals,
    }));

    return res.status(200).json({
      success: true,

      dashboard: {
        wizard: {
          id: userId,
          wizardName: req.user.wizardName,
          email: req.user.email,
          role: req.user.role,
        },

        vault,

        statistics: {
          totalTransactions,
          totalDeposits,
          totalWithdrawals,
          highestDeposit,
          highestWithdrawal,
        },

        charts: {
          monthlyData,
        },

        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
