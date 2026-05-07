import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import Message from '../models/Message';

export const getAppointmentMessages = async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
  }

  const messages = await Message.find({ appointment: appointmentId }).sort({ createdAt: 1 }).populate('sender', 'name');
  return res.json({ success: true, data: messages });
};
