export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  token?: string;
}

export interface DoctorProfile {
  _id: string;
  specialization: string;
  experience: string;
  rating: number;
  approved: boolean;
  user: {
    name: string;
    email: string;
  };
}

export interface Appointment {
  _id: string;
  date: string;
  timeSlot: string;
  status: string;
  doctor?: DoctorProfile;
}
