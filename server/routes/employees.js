const router = require("express").Router();
const Employee = require("../models/Employee");

router.get("/", async (req, res) => {
  try {
    const { dept, status, search, page = 1, limit = 10 } = req.query;
    const q = {};
    if (dept && dept !== "All") q.department = dept;
    if (status && status !== "All") q.status = status;
    if (search) q.name = { $regex: search, $options: "i" };
    const p = Math.max(+page, 1);
    const l = Math.min(+limit, 50);
    const [items, total] = await Promise.all([
      Employee.find(q)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      Employee.countDocuments(q),
    ]);
    res.json({ items, total, page: p, pages: Math.ceil(total / l) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await Employee.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
