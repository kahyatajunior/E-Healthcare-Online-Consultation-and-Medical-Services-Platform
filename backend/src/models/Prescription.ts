import mongoose, { Schema } from 'mongoose';

const prescriptionSchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  notes: { type: String },
  medications: [{ type: String }]
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
