const express = require("express");
const {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  getPrescriptionsByAppointment,
} = require("../controllers/prescriptionController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("doctor"), createPrescription);
router.get("/", protect, getMyPrescriptions);
router.get(
  "/appointment/:appointmentId",
  protect,
  getPrescriptionsByAppointment
);
router.get("/:id", protect, getPrescriptionById);

module.exports = router;
