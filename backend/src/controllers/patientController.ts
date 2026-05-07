import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import Prescription from '../models/Prescription';

export const searchDoctors = async (req: Request, res: Response) => {
  const { specialization, rating } = req.query;
  const filter: any = { approved: true };

  if (specialization) {
    filter.specialization = { $regex: specialization, $options: 'i' };
  }
  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  const doctors = await Doctor.find(filter).populate('user', 'name email');
  return res.json({ success: true, data: doctors });
};

export const bookAppointment = async (req: Request, res: Response) => {
  const { doctorId, date, timeSlot, notes } = req.body;
  const doctor = await Doctor.findById(doctorId);

  if (!doctor || !doctor.approved) {
    return res.status(404).json({ success: false, message: 'Doctor not available' });
  }

  const availability = doctor.availability.find((slot) => slot.date === date);
  if (!availability || !availability.slots.includes(timeSlot)) {
    return res.status(400).json({ success: false, message: 'Selected time slot is unavailable' });
  }

  const conflict = await Appointment.findOne({ doctor: doctor._id, date, timeSlot, status: { $ne: 'cancelled' } });
  if (conflict) {
    return res.status(409).json({ success: false, message: 'This time slot has already been booked' });
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctor._id,
    date,
    timeSlot,
    notes
  });

  return res.status(201).json({ success: true, data: appointment });
};

export const getAppointments = async (req: Request, res: Response) => {
  const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'specialization rating');
  return res.json({ success: true, data: appointments });
};

export const getDoctorAvailability = async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor || !doctor.approved) {
    return res.status(404).json({ success: false, message: 'Doctor not available' });
  }

  return res.json({ success: true, data: doctor.availability });
};

export const getPrescriptions = async (req: Request, res: Response) => {
  const prescriptions = await Prescription.find({ patient: req.user._id }).populate('doctor', 'specialization');
  return res.json({ success: true, data: prescriptions });
};
