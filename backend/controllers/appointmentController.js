const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Chat = require("../models/Chat");

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, type, reason } = req.body;

    const doctorProfile = await Doctor.findById(doctorId).populate("user");
    if (!doctorProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    if (!doctorProfile.user.isApproved) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor is not yet approved" });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorProfile.user._id,
      date: new Date(date),
      "timeSlot.startTime": timeSlot.startTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ success: false, message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorProfile.user._id,
      doctorProfile: doctorProfile._id,
      date: new Date(date),
      timeSlot,
      type: type || "chat",
      reason: reason || "",
    });

    await Chat.create({
      appointment: appointment._id,
      participants: [req.user._id, doctorProfile.user._id],
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email avatar")
      .populate("doctor", "name email avatar")
      .populate("doctorProfile", "specialization consultationFee");

    res.status(201).json({ success: true, appointment: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "This time slot is already booked" });
    }
    next(error);
  }
};

exports.getMyAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Appointment.countDocuments(filter);

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email avatar")
      .populate("doctor", "name email avatar")
      .populate("doctorProfile", "specialization consultationFee")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email avatar phone")
      .populate("doctor", "name email avatar phone")
      .populate("doctorProfile", "specialization consultationFee experience");

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const isParticipant =
      appointment.patient?._id?.toString() === req.user._id.toString() ||
      appointment.doctor?._id?.toString() === req.user._id.toString() ||
      req.user.role === "admin";

    if (!isParticipant) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const isDoctor =
      appointment.doctor.toString() === req.user._id.toString();
    const isPatient =
      appointment.patient.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isDoctor && !isPatient && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (appointment.status === status) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already " + status });
    }

    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    const allowed = validTransitions[appointment.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${appointment.status} to ${status}`,
      });
    }

    if (status === "confirmed" && !isDoctor && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Only doctor can confirm appointments" });
    }

    if (status === "completed" && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only doctor can mark appointment as completed",
      });
    }

    appointment.status = status;

    if (status === "cancelled") {
      appointment.cancelledBy = req.user._id;
      appointment.cancellationReason = cancellationReason || "";
    }

    if (status === "completed") {
      const doctorProfile = await Doctor.findOne({ user: appointment.doctor });
      if (doctorProfile) {
        doctorProfile.totalConsultations += 1;
        await doctorProfile.save();
      }
    }

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email avatar")
      .populate("doctor", "name email avatar")
      .populate("doctorProfile", "specialization consultationFee");

    res.status(200).json({ success: true, appointment: populated });
  } catch (error) {
    next(error);
  }
};
