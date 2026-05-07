import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { getAppointmentMessages } from '../controllers/chatController';

const router = express.Router();

router.get('/:appointmentId/messages', protect, authorize('doctor', 'patient'), getAppointmentMessages);

export default router;
