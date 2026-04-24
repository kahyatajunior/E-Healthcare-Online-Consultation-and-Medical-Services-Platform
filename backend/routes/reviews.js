const express = require("express");
const {
  createReview,
  getDoctorReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("patient"), createReview);
router.get("/doctor/:doctorId", getDoctorReviews);
router.delete("/:id", protect, deleteReview);

module.exports = router;
