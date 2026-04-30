const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  approveDoctor,
  toggleUserStatus,
  deleteUser,
  getAllAppointments,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/approve", approveDoctor);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/appointments", getAllAppointments);

module.exports = router;
