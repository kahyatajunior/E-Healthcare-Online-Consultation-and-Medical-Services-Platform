import { Request, Response } from 'express';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, specialization, experience } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role, isApproved: role !== 'doctor' });

  if (role === 'doctor') {
    await Doctor.create({ user: user._id, specialization, experience, approved: false });
  }

  return res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id.toString())
    }
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (user.role === 'doctor' && !user.isApproved) {
    return res.status(403).json({ success: false, message: 'Doctor account pending approval' });
  }

  return res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      token: generateToken(user._id.toString())
    }
  });
};

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  return res.json({ success: true, data: req.user });
};
