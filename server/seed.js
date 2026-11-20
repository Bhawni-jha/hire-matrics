// Synthetic HR data: kam salary + kuch departments = zyada attrition
require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");

const DEPTS = {
  Sales: {
    base: 0.34,
    salary: [3, 9],
    roles: ["Sales Executive", "Account Manager", "BDM"],
  },
  Support: {
    base: 0.3,
    salary: [2.5, 6],
    roles: ["Support Agent", "Team Lead", "QA Analyst"],
  },
  Marketing: {
    base: 0.22,
    salary: [3.5, 12],
    roles: ["SEO Analyst", "Content Writer", "Marketing Manager"],
  },
  Engineering: {
    base: 0.18,
    salary: [6, 30],
    roles: ["Software Engineer", "DevOps Engineer", "Tech Lead"],
  },
  Finance: {
    base: 0.1,
    salary: [4, 18],
    roles: ["Accountant", "Financial Analyst", "Finance Manager"],
  },
  HR: {
    base: 0.12,
    salary: [3.5, 14],
    roles: ["HR Executive", "Recruiter", "HR Manager"],
  },
  Operations: {
    base: 0.2,
    salary: [3, 10],
    roles: ["Ops Executive", "Logistics Lead", "Ops Manager"],
  },
};
const FIRST = [
  "Aarav",
  "Priya",
  "Rohit",
  "Neha",
  "Vikram",
  "Anjali",
  "Karan",
  "Sneha",
  "Amit",
  "Pooja",
  "Rahul",
  "Isha",
  "Manish",
  "Divya",
  "Arjun",
  "Kavya",
  "Sanjay",
  "Ritu",
  "Nikhil",
  "Meera",
];
const LAST = [
  "Sharma",
  "Verma",
  "Gupta",
  "Singh",
  "Yadav",
  "Mishra",
  "Patel",
  "Reddy",
  "Nair",
  "Joshi",
  "Kapoor",
  "Mehta",
  "Chauhan",
  "Tiwari",
  "Jain",
];
const REASONS_LOW_PAY = [
  "Better Salary Offer",
  "Better Salary Offer",
  "Career Growth",
  "Work Pressure",
];
const REASONS_OTHER = [
  "Career Growth",
  "Work-Life Balance",
  "Relocation",
  "Higher Studies",
  "Manager Issues",
  "Better Salary Offer",
];

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hiremetrics",
    );
  }
  await Employee.deleteMany({});
  const docs = [];
  const names = Object.keys(DEPTS);
  const now = new Date();

  for (let i = 1; i <= 1200; i++) {
    const dept = pick(names);
    const cfg = DEPTS[dept];
    const exp = +rnd(0, 12).toFixed(1);
    const salary = +Math.min(
      cfg.salary[1] * 1.3,
      rnd(cfg.salary[0], cfg.salary[1]) + exp * 0.25,
    ).toFixed(2);
    const mid = (cfg.salary[0] + cfg.salary[1]) / 2;
    // salary dept median se kam => attrition probability badhti hai
    const salaryEffect = salary < mid ? 0.18 : -0.08;
    const satisfaction = Math.max(
      1,
      Math.min(10, Math.round(rnd(3, 10) - (salary < mid ? 1 : 0))),
    );
    const prob = Math.max(
      0.03,
      Math.min(0.8, cfg.base + salaryEffect + (satisfaction < 5 ? 0.1 : 0)),
    );
    const left = Math.random() < prob;
    const joinDate = new Date(now.getTime() - rnd(120, 365 * 6) * 864e5);
    let exitDate;
    if (left) {
      const maxDays = Math.max(60, (now - joinDate) / 864e5 - 30);
      exitDate = new Date(
        Math.max(
          joinDate.getTime() + 60 * 864e5,
          now.getTime() - rnd(5, Math.min(maxDays, 540)) * 864e5,
        ),
      );
    }
    docs.push({
      empId: `HM${String(i).padStart(4, "0")}`,
      name: `${pick(FIRST)} ${pick(LAST)}`,
      department: dept,
      role: pick(cfg.roles),
      gender: pick(["Male", "Female", "Male", "Female", "Other"]),
      annualSalary: salary,
      experienceYears: exp,
      joinDate,
      status: left ? "Left" : "Active",
      exitDate,
      exitReason: left
        ? pick(salary < mid ? REASONS_LOW_PAY : REASONS_OTHER)
        : undefined,
      performanceRating: Math.ceil(rnd(0.5, 5)),
      satisfaction,
    });
  }
  await Employee.insertMany(docs);
  console.log(`Seeded ${docs.length} employees`);
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed failed:", err.message);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
