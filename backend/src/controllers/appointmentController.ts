import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';

export const getAllAppointments = async (req: Request, res: Response) => {
  const appointments = await Appointment.find().populate('patient', 'name email').populate('doctor', 'specialization');
  return res.json({ success: true, data: appointments });
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  appointment.status = req.body.status || appointment.status;
  await appointment.save();
  return res.json({ success: true, data: appointment });
};

export const getAppointmentById = async (req: Request, res: Response) => {
  const appointment = await Appointment.findById(req.params.id).populate('patient', 'name email').populate('doctor', 'specialization');

  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
  }

  return res.json({ success: true, data: appointment });
};

export const getAppointmentsByDoctor = async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  const appointments = await Appointment.find({ doctor: doctor._id }).populate('patient', 'name email');
  return res.json({ success: true, data: appointments });
};
