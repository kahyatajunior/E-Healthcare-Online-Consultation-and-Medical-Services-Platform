import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { getAllAppointments, getAppointmentsByDoctor, getAppointmentById, updateAppointmentStatus } from '../controllers/appointmentController';

const router = express.Router();

router.use(protect);
router.get('/', authorize('admin'), getAllAppointments);
router.get('/doctor', authorize('doctor'), getAppointmentsByDoctor);
router.get('/:id', authorize('doctor', 'patient'), getAppointmentById);
router.patch('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);

export default router;
