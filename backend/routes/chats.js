const express = require("express");
const {
  getChatByAppointment,
  getMyChats,
  sendMessage,
  markMessagesRead,
} = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getMyChats);
router.get("/appointment/:appointmentId", protect, getChatByAppointment);
router.post("/:chatId/messages", protect, sendMessage);
router.put("/:chatId/read", protect, markMessagesRead);

module.exports = router;
