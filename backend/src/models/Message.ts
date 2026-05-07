import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  text: { type: String, required: true }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
