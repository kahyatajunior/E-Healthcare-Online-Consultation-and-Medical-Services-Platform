import mongoose, { Schema } from 'mongoose';

const availabilitySchema = new Schema({
  date: { type: String, required: true },
  slots: [{ type: String, required: true }]
}, { _id: false });

const reviewSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String }
}, { timestamps: true });

const doctorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  availability: [availabilitySchema],
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  approved: { type: Boolean, default: false }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
