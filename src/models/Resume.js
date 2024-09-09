// models/Resume.js
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, required: true }
});

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Link to user
  name: { type: String, required: true },
  email: { type: String },
  experience: [experienceSchema],  // Array of experience objects
  education: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
