const Chat = require("../models/Chat");

exports.getChatByAppointment = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ appointment: req.params.appointmentId })
      .populate("participants", "name avatar")
      .populate("messages.sender", "name avatar");

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === req.user._id.toString()
    );

    if (!isParticipant && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

exports.getMyChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate("participants", "name avatar")
      .populate("appointment")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { content, messageType, fileUrl, fileName } = req.body;

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const message = {
      sender: req.user._id,
      content: content || "",
      messageType: messageType || "text",
      fileUrl: fileUrl || "",
      fileName: fileName || "",
    };

    chat.messages.push(message);
    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate("participants", "name avatar")
      .populate("messages.sender", "name avatar");

    const newMessage =
      updatedChat.messages[updatedChat.messages.length - 1];

    res.status(201).json({ success: true, message: newMessage, chatId: chat._id });
  } catch (error) {
    next(error);
  }
};

exports.markMessagesRead = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    chat.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.user._id.toString()) {
        msg.isRead = true;
      }
    });

    await chat.save();

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    next(error);
  }
};
