const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getResumeById,
  getMyResumes,
} = require("../controllers/resumeController");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get(
  "/",
  protect,
  getMyResumes
);

router.get(
  "/:id",
  protect,
  getResumeById
);

module.exports = router;