const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createJobMatch,
} = require("../controllers/jobMatchController");

const router = express.Router();

router.post(
  "/",
  protect,
  createJobMatch
);

module.exports = router;