import express from 'express';
import { authorize, protect } from '../middleware/auth';
import { approveDoctor, getDoctorRequests, getReports, getStats } from '../controllers/adminController';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/doctors/pending', getDoctorRequests);
router.put('/doctors/:id/approve', approveDoctor);
router.get('/reports', getReports);

export default router;
