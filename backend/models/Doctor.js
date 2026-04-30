const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Please provide specialization"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "Please provide years of experience"],
      min: 0,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },
    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: [timeSlotSchema],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalConsultations: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 1 });
doctorSchema.index({ rating: -1 });

module.exports = mongoose.model("Doctor", doctorSchema);
