import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

import "./TransactionChart.css";

const TransactionChart = ({ monthlyData = [] }) => {
  const chartData = monthlyData.map((item) => ({
    month: item.month,
    deposits: Number(item.deposits) || 0,
    withdrawals: Number(item.withdrawals) || 0,
  }));

  const depositColors = [
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#22c55e",
    "#16a34a",
    "#15803d",
  ];

  const withdrawColors = [
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#ef4444",
    "#dc2626",
    "#b91c1c",
  ];

  return (
    <div className="transaction-chart">

      <h2>📈 Monthly Banking Analytics</h2>

      <div className="chart-wrapper">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#334155"
              opacity={0.35}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#94a3b8",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(255,215,0,.08)",
              }}
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: 10,
              }}
            />

            <Bar
              dataKey="deposits"
              name="Deposits"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    depositColors[
                      index % depositColors.length
                    ]
                  }
                />
              ))}
            </Bar>

            <Bar
              dataKey="withdrawals"
              name="Withdrawals"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    withdrawColors[
                      index % withdrawColors.length
                    ]
                  }
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default TransactionChart;