import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { getDoctorPrescriptions, getPatientPrescriptions } from '../controllers/prescriptionController';

const router = express.Router();

router.get('/patient', protect, authorize('patient'), getPatientPrescriptions);
router.get('/doctor', protect, authorize('doctor'), getDoctorPrescriptions);

export default router;
