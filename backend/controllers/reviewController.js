const Review = require("../models/Review");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.createReview = async (req, res, next) => {
  try {
    const { doctorProfileId, rating, comment, appointmentId } = req.body;

    const doctorProfile = await Doctor.findById(doctorProfileId);
    if (!doctorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const existingReview = await Review.findOne({
      patient: req.user._id,
      doctor: doctorProfile.user,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this doctor",
      });
    }

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (
        !appointment ||
        appointment.patient.toString() !== req.user._id.toString() ||
        appointment.status !== "completed"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment for review",
        });
      }
    }

    const review = await Review.create({
      patient: req.user._id,
      doctor: doctorProfile.user,
      doctorProfile: doctorProfile._id,
      appointment: appointmentId,
      rating,
      comment: comment || "",
    });

    const populated = await Review.findById(review._id).populate(
      "patient",
      "name avatar"
    );

    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Review.countDocuments({
      doctorProfile: req.params.doctorId,
    });

    const reviews = await Review.find({ doctorProfile: req.params.doctorId })
      .populate("patient", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (
      review.patient.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
