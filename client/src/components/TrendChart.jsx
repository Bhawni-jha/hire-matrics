import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function TrendChart({ data }) {
  return (
    <div className="card">
      <h3>Monthly Exits Trend</h3>
      <p className="sub">Employees who left the organization each month</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis allowDecimals={false} stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#172033",
            }}
          />
          <Area
            type="monotone"
            dataKey="exits"
            stroke="#ef4444"
            fill="#ef444433"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
