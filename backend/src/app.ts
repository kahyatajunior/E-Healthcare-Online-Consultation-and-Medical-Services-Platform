import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import chatRoutes from './routes/chat';
import doctorRoutes from './routes/doctors';
import patientRoutes from './routes/patients';
import appointmentRoutes from './routes/appointments';
import prescriptionRoutes from './routes/prescriptions';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'E-Healthcare API is healthy' }));

app.use(errorHandler);

export default app;
