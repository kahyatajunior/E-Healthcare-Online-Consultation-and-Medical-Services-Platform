const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("patient"), createAppointment);
router.get("/", protect, getMyAppointments);
router.get("/:id", protect, getAppointmentById);
router.put("/:id/status", protect, updateAppointmentStatus);

module.exports = router;
