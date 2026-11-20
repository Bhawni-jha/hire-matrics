require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Employee = require("./models/Employee");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/employees", require("./routes/employees"));

const PORT = process.env.PORT || 7000;

async function start() {
  let uri = process.env.MONGO_URI;

  try {
    if (!uri) throw new Error("MONGO_URI is not configured");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected");
  } catch (configuredError) {
    console.warn(`Configured MongoDB unavailable: ${configuredError.message}`);
    const memory = await MongoMemoryServer.create();
    uri = memory.getUri();
    await mongoose.connect(uri);
    console.log("Using embedded MongoDB for local development");
  }

  if ((await Employee.countDocuments()) === 0) {
    const { seedDatabase } = require("./seed");
    await seedDatabase();
  }

  app.listen(PORT, () =>
    console.log(`API running on http://localhost:${PORT}`),
  );
}

start().catch((err) => {
  console.error("Server startup failed:", err.message);
  process.exit(1);
});
