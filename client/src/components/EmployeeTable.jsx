import { useEffect, useState } from "react";
import { get } from "../api";

export default function EmployeeTable({ dept }) {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ items: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => setPage(1), [dept, status, search]);
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      get("/employees", { dept, status, search, page, limit: 10 })
        .then((data) => {
          setRes(data);
          setError("");
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [dept, status, search, page]);

  return (
    <div className="card">
      <h3>Employees ({res.total})</h3>
      <div className="toolbar">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Left</option>
        </select>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Salary (LPA)</th>
              <th>Exp</th>
              <th>Status</th>
              <th>Exit Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="table-state">Loading employees...</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan="8" className="table-state">Unable to load employees: {error}</td>
              </tr>
            )}
            {!loading && !error && res.items.length === 0 && (
              <tr>
                <td colSpan="8" className="table-state">No employees match these filters.</td>
              </tr>
            )}
            {res.items.map((e) => (
              <tr key={e._id}>
                <td>{e.empId}</td>
                <td>{e.name}</td>
                <td>{e.department}</td>
                <td>{e.role}</td>
                <td>₹{e.annualSalary}</td>
                <td>{e.experienceYears} yrs</td>
                <td>
                  <span className={`badge ${e.status}`}>{e.status}</span>
                </td>
                <td>{e.exitReason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {res.pages || 1}
        </span>
        <button disabled={page >= res.pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
