const {
  generateResumeContent,
} = require("../services/aiService");

const createResumeContent = async (req, res) => {
  try {
    const {
      name,
      role,
      skills,
      experience,
      projects,
    } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and target role are required",
      });
    }

    const content = await generateResumeContent({
      name,
      role,
      skills: skills || "",
      experience: experience || "",
      projects: projects || "",
    });

    res.status(200).json({
      message: "Resume content generated successfully",
      content,
    });
  } catch (error) {
    console.error(
      "Resume builder error:",
      error
    );

    res.status(500).json({
      message: "Failed to generate resume content",
      error: error.message,
    });
  }
};

const PDFDocument = require("pdfkit");

const downloadResumePDF = async (req, res) => {
  try {
    const {
      name,
      role,
      professionalSummary,
      technicalSkills,
      experience,
      projects,
    } = req.body;

    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="resume.pdf"'
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(name, {
        align: "center",
      });

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(role, {
        align: "center",
      });

    doc.moveDown(1);

    // Summary
    if (professionalSummary) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("PROFESSIONAL SUMMARY");

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(professionalSummary);

      doc.moveDown(0.8);
    }

    // Skills
    if (technicalSkills?.length) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("TECHNICAL SKILLS");

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(technicalSkills.join(" • "));

      doc.moveDown(0.8);
    }

    // Experience
    if (experience?.length) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("EXPERIENCE");

      doc.moveDown(0.3);

      experience.forEach((item) => {
        if (typeof item === "object") {
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(item.title || "");

          doc
            .fontSize(10)
            .font("Helvetica")
            .text(item.description || "");
        } else {
          doc
            .fontSize(10)
            .font("Helvetica")
            .text(`• ${item}`);
        }

        doc.moveDown(0.4);
      });

      doc.moveDown(0.5);
    }

    // Projects
    if (projects?.length) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("PROJECTS");

      doc.moveDown(0.3);

      projects.forEach((item) => {
        if (typeof item === "object") {
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(item.title || "");

          doc
            .fontSize(10)
            .font("Helvetica")
            .text(item.description || "");
        } else {
          doc
            .fontSize(10)
            .font("Helvetica")
            .text(`• ${item}`);
        }

        doc.moveDown(0.4);
      });
    }

    doc.end();

  } catch (error) {
    console.error(
      "PDF generation error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate PDF",
        error: error.message,
      });
    }
  }
};

module.exports = {
  createResumeContent,
  downloadResumePDF,
};