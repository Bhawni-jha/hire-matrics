import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function SalaryBandChart({ data }) {
  return (
    <div className="card">
      <h3>Salary vs Attrition</h3>
      <p className="sub">
        Employee count and attrition rate by salary band
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="band" stroke="#64748b" />
          <YAxis yAxisId="l" stroke="#64748b" />
          <YAxis yAxisId="r" orientation="right" unit="%" stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#172033",
            }}
          />
          <Legend />
          <Bar
            yAxisId="l"
            dataKey="total"
            name="Total"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            yAxisId="l"
            dataKey="left"
            name="Left"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="r"
            type="monotone"
            dataKey="attritionRate"
            name="Attrition %"
            stroke="#f59e0b"
            strokeWidth={3}
            dot
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
