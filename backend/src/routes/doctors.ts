import express from 'express';
import { authorize, protect } from '../middleware/auth';
import {
  createPrescription,
  getDoctorAvailability,
  getDoctorProfile,
  listDoctorAppointments,
  updateAppointmentStatus,
  updateDoctorAvailability,
  updateDoctorProfile
} from '../controllers/doctorController';

const router = express.Router();

router.use(protect, authorize('doctor'));
router.get('/me', getDoctorProfile);
router.put('/me', updateDoctorProfile);
router.get('/appointments', listDoctorAppointments);
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.get('/availability', getDoctorAvailability);
router.put('/availability', updateDoctorAvailability);
router.post('/prescriptions', createPrescription);

export default router;
