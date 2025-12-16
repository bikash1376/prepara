import mongoose from "mongoose";

const testProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  currentSection: {
    type: Number,
    default: 0,
  },
  currentModule: {
    type: Number,
    default: 0,
  },
  timer: {
    type: Number,
    required: true,
  },
  // Store answers structure: {sectionIdx: {moduleIdx: [answers]}}
  moduleAnswers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // Store reviewed questions {sectionIdx: {moduleIdx: [qIdxs]}} 
  // Note: Sets will need to be converted to Arrays for storage
  reviewedQuestions: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // Store struckOutOptions {sectionIdx: {moduleIdx: { qIdx: [optIdxs] } }}
  // Sets need to be Arrays
  struckOutOptions: {
     type: mongoose.Schema.Types.Mixed,
     default: {},
  },
  status: {
    type: String,
    enum: ["IN_PROGRESS", "PAUSED", "COMPLETED"],
    default: "IN_PROGRESS",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique progress record per user per test
testProgressSchema.index({ userId: 1, testId: 1 }, { unique: true });

export default mongoose.model("TestProgress", testProgressSchema);
