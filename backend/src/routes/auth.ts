import express from 'express';
import { getProfile, loginUser, registerUser } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

export default router;
