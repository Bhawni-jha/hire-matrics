import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ScatterChartCard({ data }) {
  const left = data.filter((d) => d.status === "Left");
  const active = data.filter((d) => d.status === "Active");
  return (
    <div className="card">
      <h3>Salary vs Experience</h3>
      <p className="sub">Random sample of up to 400 employees</p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="exp"
            name="Experience"
            unit=" yrs"
            stroke="#64748b"
          />
          <YAxis
            type="number"
            dataKey="salary"
            name="Salary"
            unit=" L"
            stroke="#64748b"
          />
          <ZAxis range={[40, 40]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              color: "#172033",
            }}
          />
          <Legend />
          <Scatter
            name="Active"
            data={active}
            fill="#22c55e"
            fillOpacity={0.6}
          />
          <Scatter name="Left" data={left} fill="#ef4444" fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
