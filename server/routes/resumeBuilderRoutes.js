const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createResumeContent,
  downloadResumePDF,
} = require("../controllers/resumeBuilderController");

const router = express.Router();

router.post(
  "/",
  protect,
  createResumeContent
);

router.post(
  "/pdf",
  protect,
  downloadResumePDF
);

module.exports = router;