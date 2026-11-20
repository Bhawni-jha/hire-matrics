export default function KpiCards({ s }) {
  if (!s) return null;
  const gap = +(s.avgSalaryActive - s.avgSalaryLeft).toFixed(2);
  return (
    <div className="kpis">
      <div className="kpi">
        <small>Total Employees</small>
        <h2>{s.total}</h2>
      </div>
      <div className="kpi ok">
        <small>Active</small>
        <h2>{s.active}</h2>
      </div>
      <div className="kpi danger">
        <small>Employees Left</small>
        <h2>{s.left}</h2>
      </div>
      <div className="kpi danger">
        <small>Attrition Rate</small>
        <h2>{s.attritionRate}%</h2>
      </div>
      <div className="kpi">
        <small>Avg Salary (Left)</small>
        <h2>₹{s.avgSalaryLeft} L</h2>
      </div>
      <div className="kpi">
        <small>Avg Salary (Active)</small>
        <h2>₹{s.avgSalaryActive} L</h2>
        <small>Gap: ₹{gap} L</small>
      </div>
    </div>
  );
}
