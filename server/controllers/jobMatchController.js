const JobMatch = require("../models/JobMatch");
const Resume = require("../models/Resume");
const {
  matchResumeToJob,
} = require("../services/aiService");

const createJobMatch = async (req, res) => {
  try {
    const {
      resumeId,
      jobTitle,
      jobDescription,
    } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        message:
          "Resume ID and job description are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const matchAnalysis = await matchResumeToJob(
      resume.extractedText,
      jobDescription
    );

    const jobMatch = await JobMatch.create({
      user: req.user._id,
      resume: resume._id,
      jobTitle: jobTitle || "Job Opportunity",
      jobDescription,
      matchAnalysis,
    });

    res.status(201).json({
      message: "Job match analysis completed",
      jobMatch,
    });
  } catch (error) {
    console.error("Job match error:", error);

    res.status(500).json({
      message: "Job match analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  createJobMatch,
};