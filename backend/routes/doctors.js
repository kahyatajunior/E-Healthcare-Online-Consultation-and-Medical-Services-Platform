const express = require("express");
const {
  getAllDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateAvailability,
  getSpecializations,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/specializations", getSpecializations);
router.get("/user/:userId", getDoctorByUserId);
router.get("/:id", getDoctorById);
router.put("/availability", protect, authorize("doctor"), updateAvailability);

module.exports = router;
