import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { bookAppointment, getAppointments, getDoctorAvailability, getPrescriptions, searchDoctors } from '../controllers/patientController';

const router = express.Router();

router.get('/doctors', searchDoctors);
router.get('/doctors/:id/availability', protect, authorize('patient'), getDoctorAvailability);
router.post('/appointments', protect, authorize('patient'), bookAppointment);
router.get('/appointments', protect, authorize('patient'), getAppointments);
router.get('/prescriptions', protect, authorize('patient'), getPrescriptions);

export default router;
