import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import Prescription from '../models/Prescription';

export const getDoctorProfile = async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  return res.json({ success: true, data: doctor });
};

export const updateDoctorProfile = async (req: Request, res: Response) => {
  const { specialization, experience, availability } = req.body;
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  doctor.specialization = specialization || doctor.specialization;
  doctor.experience = experience || doctor.experience;
  doctor.availability = availability || doctor.availability;
  await doctor.save();

  return res.json({ success: true, data: doctor });
};

export const getDoctorAvailability = async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  return res.json({ success: true, data: doctor.availability });
};

export const updateDoctorAvailability = async (req: Request, res: Response) => {
  const { availability } = req.body;
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  doctor.availability = availability || doctor.availability;
  await doctor.save();

  return res.json({ success: true, data: doctor.availability });
};

export const listDoctorAppointments = async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  const appointments = await Appointment.find({ doctor: doctor._id }).populate('patient', 'name email');
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

export const createPrescription = async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  const prescription = await Prescription.create({
    doctor: doctor._id,
    patient: req.body.patientId,
    appointment: req.body.appointmentId,
    notes: req.body.notes,
    medications: req.body.medications || []
  });

  return res.status(201).json({ success: true, data: prescription });
};
