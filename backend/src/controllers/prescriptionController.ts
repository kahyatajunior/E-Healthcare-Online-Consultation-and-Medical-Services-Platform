import { Request, Response } from 'express';
import Prescription from '../models/Prescription';
import Doctor from '../models/Doctor';

export const getPatientPrescriptions = async (req: Request, res: Response) => {
  const prescriptions = await Prescription.find({ patient: req.user._id }).populate('doctor', 'specialization');
  return res.json({ success: true, data: prescriptions });
};

export const getDoctorPrescriptions = async (req: Request, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  const prescriptions = await Prescription.find({ doctor: doctor._id }).populate('patient', 'name email');
  return res.json({ success: true, data: prescriptions });
};
