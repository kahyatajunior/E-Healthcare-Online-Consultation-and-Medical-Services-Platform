export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  phone?: string;
  avatar?: string;
  isApproved?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorProfile {
  _id: string;
  user: User;
  specialization: string;
  experience: number;
  qualifications: string[];
  bio: string;
  consultationFee: number;
  availability: TimeSlot[];
  rating: number;
  totalReviews: number;
  totalConsultations: number;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: User;
  doctorProfile: DoctorProfile;
  date: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "chat" | "video";
  reason: string;
  notes: string;
  cancelledBy?: User;
  cancellationReason?: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  _id: string;
  doctor: User;
  patient: User;
  appointment?: Appointment;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  followUpDate?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  patient: User;
  doctor: User;
  doctorProfile: DoctorProfile;
  appointment?: Appointment;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  sender: User;
  content: string;
  messageType: "text" | "image" | "file";
  fileUrl: string;
  fileName: string;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  _id: string;
  appointment: Appointment;
  participants: User[];
  messages: ChatMessage[];
  isActive: boolean;
  updatedAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  approvedDoctors: number;
  pendingDoctors: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  [key: string]: T[] | boolean | number | string;
}
