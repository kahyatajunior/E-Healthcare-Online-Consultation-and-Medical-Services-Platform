const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ doctor: 1 });
reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (doctorProfileId) {
  const result = await this.aggregate([
    { $match: { doctorProfile: doctorProfileId } },
    {
      $group: {
        _id: "$doctorProfile",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const Doctor = mongoose.model("Doctor");
  if (result.length > 0) {
    await Doctor.findByIdAndUpdate(doctorProfileId, {
      rating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    });
  } else {
    await Doctor.findByIdAndUpdate(doctorProfileId, {
      rating: 0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.doctorProfile);
});

reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.doctorProfile);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
