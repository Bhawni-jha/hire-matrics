const router = require("express").Router();
const Employee = require("../models/Employee");

const buildMatch = (q) => {
  const m = {};
  if (q.dept && q.dept !== "All") m.department = q.dept;
  return m;
};

// KPI cards
router.get("/summary", async (req, res) => {
  try {
    const [r] = await Employee.aggregate([
      { $match: buildMatch(req.query) },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          left: { $sum: { $cond: [{ $eq: ["$status", "Left"] }, 1, 0] } },
          avgSalaryLeft: {
            $avg: {
              $cond: [{ $eq: ["$status", "Left"] }, "$annualSalary", null],
            },
          },
          avgSalaryActive: {
            $avg: {
              $cond: [{ $eq: ["$status", "Active"] }, "$annualSalary", null],
            },
          },
        },
      },
    ]);
    const s = r || { total: 0, left: 0 };
    res.json({
      total: s.total,
      left: s.left,
      active: s.total - s.left,
      attritionRate: s.total ? +((s.left / s.total) * 100).toFixed(1) : 0,
      avgSalaryLeft: +(s.avgSalaryLeft || 0).toFixed(2),
      avgSalaryActive: +(s.avgSalaryActive || 0).toFixed(2),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Kaun se department mein sabse zyada attrition
router.get("/by-department", async (_req, res) => {
  try {
    const data = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          left: { $sum: { $cond: [{ $eq: ["$status", "Left"] }, 1, 0] } },
          avgSalary: { $avg: "$annualSalary" },
          avgSalaryLeft: {
            $avg: {
              $cond: [{ $eq: ["$status", "Left"] }, "$annualSalary", null],
            },
          },
          avgSalaryActive: {
            $avg: {
              $cond: [{ $eq: ["$status", "Active"] }, "$annualSalary", null],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          total: 1,
          left: 1,
          attritionRate: {
            $round: [{ $multiply: [{ $divide: ["$left", "$total"] }, 100] }, 1],
          },
          avgSalary: { $round: ["$avgSalary", 2] },
          avgSalaryLeft: { $round: [{ $ifNull: ["$avgSalaryLeft", 0] }, 2] },
          avgSalaryActive: {
            $round: [{ $ifNull: ["$avgSalaryActive", 0] }, 2],
          },
        },
      },
      { $sort: { attritionRate: -1 } },
    ]);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Salary vs attrition (salary bands)
const BOUNDS = [0, 3, 5, 8, 12, 20, 1000];
const LABELS = {
  0: "0-3 LPA",
  3: "3-5 LPA",
  5: "5-8 LPA",
  8: "8-12 LPA",
  12: "12-20 LPA",
  20: "20+ LPA",
};

router.get("/salary-bands", async (req, res) => {
  try {
    const data = await Employee.aggregate([
      { $match: buildMatch(req.query) },
      {
        $bucket: {
          groupBy: "$annualSalary",
          boundaries: BOUNDS,
          default: "Other",
          output: {
            total: { $sum: 1 },
            left: { $sum: { $cond: [{ $eq: ["$status", "Left"] }, 1, 0] } },
          },
        },
      },
    ]);
    res.json(
      data
        .filter((d) => d._id !== "Other")
        .map((d) => ({
          band: LABELS[d._id],
          total: d.total,
          left: d.left,
          attritionRate: +((d.left / d.total) * 100).toFixed(1),
        })),
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Scatter: salary vs experience, coloured by status
router.get("/salary-scatter", async (req, res) => {
  try {
    const data = await Employee.aggregate([
      { $match: buildMatch(req.query) },
      { $sample: { size: 400 } },
      {
        $project: {
          _id: 0,
          salary: "$annualSalary",
          exp: "$experienceYears",
          status: 1,
          name: 1,
        },
      },
    ]);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Monthly exits trend
router.get("/trend", async (req, res) => {
  try {
    const data = await Employee.aggregate([
      {
        $match: {
          ...buildMatch(req.query),
          status: "Left",
          exitDate: { $ne: null },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$exitDate" } },
          exits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: "$_id", exits: 1 } },
    ]);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Exit reasons
router.get("/reasons", async (req, res) => {
  try {
    const data = await Employee.aggregate([
      { $match: { ...buildMatch(req.query), status: "Left" } },
      { $group: { _id: "$exitReason", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, reason: "$_id", count: 1 } },
    ]);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
