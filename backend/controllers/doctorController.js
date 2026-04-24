const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Review = require("../models/Review");

exports.getAllDoctors = async (req, res, next) => {
  try {
    const {
      specialization,
      minRating,
      maxFee,
      search,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" };
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    if (maxFee) {
      filter.consultationFee = { $lte: Number(maxFee) };
    }

    let sort = { rating: -1 };
    if (sortBy === "fee_low") sort = { consultationFee: 1 };
    if (sortBy === "fee_high") sort = { consultationFee: -1 };
    if (sortBy === "experience") sort = { experience: -1 };
    if (sortBy === "rating") sort = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    let query = Doctor.find(filter)
      .populate({
        path: "user",
        select: "name email avatar isApproved isActive",
        match: { isApproved: true, isActive: true },
      })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    let doctors = await query;
    doctors = doctors.filter((doc) => doc.user !== null);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      doctors = doctors.filter(
        (doc) =>
          searchRegex.test(doc.user.name) ||
          searchRegex.test(doc.specialization)
      );
    }

    const total = await Doctor.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate({
      path: "user",
      select: "name email avatar phone isApproved",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const reviews = await Review.find({ doctorProfile: doctor._id })
      .populate({ path: "patient", select: "name avatar" })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, doctor, reviews });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorByUserId = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.userId }).populate({
      path: "user",
      select: "name email avatar phone isApproved",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor profile not found" });
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

exports.getSpecializations = async (_req, res, next) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    res.status(200).json({ success: true, specializations });
  } catch (error) {
    next(error);
  }
};
