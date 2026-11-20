# HireMetrics — HR Attrition Dashboard (MERN)

This dashboard shows which departments have higher employee attrition and how salary is associated with attrition.

## Stack
- **MongoDB + Mongoose** — employee data, aggregation pipelines
- **Express + Node** — REST API
- **React (Vite) + Recharts** — dashboard UI

## Setup

### 1. Backend
```bash
cd server
npm install
copy .env.example .env
npm run seed              # Optional: seed the configured MongoDB
npm run dev               # http://localhost:5000
```
Run local MongoDB, or configure an Atlas URI in `.env`. If MongoDB is unavailable,
the server starts an embedded database and automatically seeds 1,200 demo employees.

### 2. Frontend
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

## API Endpoints
| Method | Route | Kaam |
|---|---|---|
| GET | `/api/analytics/summary?dept=` | KPI cards (total, left, rate, avg salary) |
| GET | `/api/analytics/by-department` | Dept-wise attrition rate + avg salary left vs active |
| GET | `/api/analytics/salary-bands?dept=` | Salary band vs attrition |
| GET | `/api/analytics/salary-scatter?dept=` | Salary vs experience scatter |
| GET | `/api/analytics/trend?dept=` | Monthly exits |
| GET | `/api/analytics/reasons?dept=` | Exit reasons |
| GET/POST/PUT/DELETE | `/api/employees` | Employee CRUD (search, filter, pagination) |

## Attrition Rate Formula
`Attrition % = (Employees Left / Total Employees) × 100`

## Using Your Own Data
Replace the sample records in `server/seed.js` or import a CSV into the `Employee`
collection. Fields: `empId, name, department, role, annualSalary (LPA),
experienceYears, joinDate, status (Active/Left), exitDate, exitReason`.

## Future Enhancements
- JWT login (HR admin)
- CSV upload se bulk import
- Attrition prediction (logistic regression / Python microservice)
- Export report to PDF/Excel
