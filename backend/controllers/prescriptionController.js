const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

exports.createPrescription = async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosis, medications, notes, followUpDate } =
      req.body;

    if (req.user.role !== "doctor") {
      return res
        .status(403)
        .json({ success: false, message: "Only doctors can create prescriptions" });
    }

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res
          .status(404)
          .json({ success: false, message: "Appointment not found" });
      }
      if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized for this appointment" });
      }
    }

    const prescription = await Prescription.create({
      doctor: req.user._id,
      patient: patientId,
      appointment: appointmentId,
      diagnosis,
      medications: medications || [],
      notes: notes || "",
      followUpDate,
    });

    const populated = await Prescription.findById(prescription._id)
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .populate("appointment");

    res.status(201).json({ success: true, prescription: populated });
  } catch (error) {
    next(error);
  }
};

exports.getMyPrescriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Prescription.countDocuments(filter);

    const prescriptions = await Prescription.find(filter)
      .populate("doctor", "name email avatar")
      .populate("patient", "name email avatar")
      .populate("appointment")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("doctor", "name email avatar phone")
      .populate("patient", "name email avatar phone")
      .populate("appointment");

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found" });
    }

    const isAuthorized =
      prescription.doctor?._id?.toString() === req.user._id.toString() ||
      prescription.patient?._id?.toString() === req.user._id.toString() ||
      req.user.role === "admin";

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, prescription });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptionsByAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const isAuthorized =
      appointment.patient.toString() === req.user._id.toString() ||
      appointment.doctor.toString() === req.user._id.toString() ||
      req.user.role === "admin";

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const prescriptions = await Prescription.find({
      appointment: req.params.appointmentId,
    })
      .populate("doctor", "name email avatar")
      .populate("patient", "name email avatar");

    res.status(200).json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};
