const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/aiService");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume",
      });
    }

    // Read uploaded PDF
    const fileBuffer = fs.readFileSync(req.file.path);

    // Extract PDF text
    const parser = new PDFParse({
      data: fileBuffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    if (!pdfData.text || pdfData.text.trim().length < 50) {
      return res.status(400).json({
        message: "Could not extract enough text from the PDF",
      });
    }

    // AI Analysis
    const aiAnalysis = await analyzeResume(pdfData.text);

    // Save resume + AI analysis
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      extractedText: pdfData.text,
      aiAnalysis,
    });

    res.status(201).json({
      message: "Resume uploaded and analyzed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        aiAnalysis: resume.aiAnalysis,
      },
    });

  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select("-extractedText");

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};
const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    })
      .select("-extractedText")
      .sort({ createdAt: -1 });

    res.json({
      message: "Resumes fetched successfully",
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};
module.exports = {
  uploadResume,
  getResumeById,
  getMyResumes,
};