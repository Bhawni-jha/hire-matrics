const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true, index: true },
    role: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    annualSalary: { type: Number, required: true }, // in LPA (lakhs per annum)
    experienceYears: Number,
    joinDate: Date,
    status: { type: String, enum: ['Active', 'Left'], default: 'Active', index: true },
    exitDate: Date,
    exitReason: String,
    performanceRating: { type: Number, min: 1, max: 5 },
    satisfaction: { type: Number, min: 1, max: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
