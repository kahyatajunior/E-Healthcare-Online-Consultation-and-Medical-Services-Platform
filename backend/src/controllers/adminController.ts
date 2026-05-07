import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import Prescription from '../models/Prescription';
import User from '../models/User';

export const getStats = async (req: Request, res: Response) => {
  const userCount = await User.countDocuments();
  const doctorCount = await Doctor.countDocuments({ approved: true });
  const appointmentCount = await Appointment.countDocuments();
  const prescriptionCount = await Prescription.countDocuments();

  return res.json({
    success: true,
    data: { userCount, doctorCount, appointmentCount, prescriptionCount }
  });
};

export const getDoctorRequests = async (req: Request, res: Response) => {
  const requests = await Doctor.find({ approved: false }).populate('user', 'name email');
  return res.json({ success: true, data: requests });
};

export const approveDoctor = async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  doctor.approved = true;
  await doctor.save();

  await User.findByIdAndUpdate(doctor.user, { isApproved: true });

  return res.json({ success: true, data: doctor });
};

export const getReports = async (req: Request, res: Response) => {
  return res.json({ success: true, data: [] });
};
