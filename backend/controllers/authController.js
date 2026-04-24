const { validationResult } = require("express-validator");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "patient",
      phone,
      isApproved: role === "doctor" ? false : true,
    });

    if (role === "doctor") {
      const { specialization, experience, qualifications, bio, consultationFee } =
        req.body;
      await Doctor.create({
        user: user._id,
        specialization: specialization || "General",
        experience: experience || 0,
        qualifications: qualifications || [],
        bio: bio || "",
        consultationFee: consultationFee || 0,
      });
    }

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Account has been deactivated" });
    }

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let doctorProfile = null;

    if (user.role === "doctor") {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isApproved: user.isApproved,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      doctorProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (req.user.role === "doctor") {
      const {
        specialization,
        experience,
        qualifications,
        bio,
        consultationFee,
        availability,
      } = req.body;
      const doctorUpdate = {};
      if (specialization) doctorUpdate.specialization = specialization;
      if (experience !== undefined) doctorUpdate.experience = experience;
      if (qualifications) doctorUpdate.qualifications = qualifications;
      if (bio !== undefined) doctorUpdate.bio = bio;
      if (consultationFee !== undefined)
        doctorUpdate.consultationFee = consultationFee;
      if (availability) doctorUpdate.availability = availability;

      await Doctor.findOneAndUpdate({ user: req.user._id }, doctorUpdate, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    const token = user.generateToken();
    res.status(200).json({ success: true, token, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
