import mongoose, { Schema } from 'mongoose';

const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
