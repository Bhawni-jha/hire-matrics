import { useEffect, useState } from "react";
import { get } from "./api";
import KpiCards from "./components/KpiCards";
import DepartmentChart from "./components/DepartmentChart";
import SalaryBandChart from "./components/SalaryBandChart";
import AvgSalaryChart from "./components/AvgSalaryChart";
import ScatterChartCard from "./components/ScatterChartCard";
import TrendChart from "./components/TrendChart";
import ReasonsChart from "./components/ReasonsChart";
import EmployeeTable from "./components/EmployeeTable";

export default function App() {
  const [dept, setDept] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [bands, setBands] = useState([]);
  const [scatter, setScatter] = useState([]);
  const [trend, setTrend] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get("/analytics/by-department")
      .then(setDepartments)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    const p = { dept };
    Promise.all([
      get("/analytics/summary", p),
      get("/analytics/salary-bands", p),
      get("/analytics/salary-scatter", p),
      get("/analytics/trend", p),
      get("/analytics/reasons", p),
    ])
      .then(([s, b, sc, t, r]) => {
        setSummary(s);
        setBands(b);
        setScatter(sc);
        setTrend(t);
        setReasons(r);
        setError("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [dept]);

  const top = departments[0];
  const worstBand = [...bands].sort(
    (a, b) => b.attritionRate - a.attritionRate,
  )[0];

  if (loading) return <div className="msg">Loading dashboard...</div>;

  if (error)
    return (
      <div className="msg error-message">
        <strong>Unable to load the dashboard</strong>
        <span>{error}</span>
        <span>Make sure the backend is running on port 5000.</span>
      </div>
    );

  return (
    <div className="container">
      <header>
        <div>
          <div className="eyebrow">People Analytics</div>
          <h1>
            <span>HireMetrics</span> Attrition Dashboard
          </h1>
          <p>Understand workforce trends, compensation impact, and exit patterns.</p>
        </div>
        <div className="header-controls">
          <div className="live-status"><span /> Live data</div>
          <label>
            <span>Department</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.department}>{d.department}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <KpiCards s={summary} />

      {top && (
        <div className="insight">
          <span className="insight-icon">!</span>
          <div>
          <b>{top.department}</b> has the highest attrition at{" "}
          <b>{top.attritionRate}%</b> ({top.left} of {top.total} employees).
          {worstBand && (
            <>
              {" "}
              The <b>{worstBand.band}</b> salary band has the highest attrition (
              <b>{worstBand.attritionRate}%</b>).
            </>
          )}
          {summary && summary.avgSalaryActive > summary.avgSalaryLeft && (
            <>
              {" "}
              Employees who left earned an average of ₹
              {(summary.avgSalaryActive - summary.avgSalaryLeft).toFixed(2)} LPA less
              than active employees.
            </>
          )}
          </div>
        </div>
      )}

      <div className="grid">
        <DepartmentChart data={departments} />
        <SalaryBandChart data={bands} />
      </div>
      <div className="grid">
        <AvgSalaryChart data={departments} />
        <ScatterChartCard data={scatter} />
      </div>
      <div className="grid">
        <TrendChart data={trend} />
        <ReasonsChart data={reasons} />
      </div>

      <EmployeeTable dept={dept} />
    </div>
  );
}
