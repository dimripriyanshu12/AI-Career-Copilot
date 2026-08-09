const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    jobTitle: {
      type: String,
      default: "Job Opportunity",
    },

    jobDescription: {
      type: String,
      required: true,
    },

    matchAnalysis: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "JobMatch",
  jobMatchSchema
);