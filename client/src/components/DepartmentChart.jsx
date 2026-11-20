import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

export default function DepartmentChart({ data }) {
  return (
    <div className="card">
      <h3>Department-wise Attrition Rate</h3>
      <p className="sub">
        Attrition by department
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 20, right: 30 }}
        >
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis type="number" unit="%" stroke="#64748b" />
          <YAxis
            type="category"
            dataKey="department"
            stroke="#64748b"
            width={90}
          />
          <Tooltip
            formatter={(v, n, p) => [
              `${v}% (${p.payload.left}/${p.payload.total})`,
              "Attrition",
            ]}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#172033",
            }}
          />
          <Bar dataKey="attritionRate" radius={[0, 6, 6, 0]}>
            {data.map((d, i) => (
              <Cell
                key={d.department}
                fill={i === 0 ? "#ef4444" : i < 3 ? "#f59e0b" : "#6366f1"}
              />
            ))}
            <LabelList
              dataKey="attritionRate"
              position="right"
              formatter={(v) => `${v}%`}
              fill="#172033"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
