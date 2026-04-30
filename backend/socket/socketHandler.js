const jwt = require("jsonwebtoken");
const Chat = require("../models/Chat");
const User = require("../models/User");

const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.userName = user.name;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userName} (${socket.userId})`);
    onlineUsers.set(socket.userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);
      console.log(`${socket.userName} joined chat: ${chatId}`);
    });

    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`${socket.userName} left chat: ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, content, messageType, fileUrl, fileName } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const isParticipant = chat.participants.some(
          (p) => p.toString() === socket.userId
        );
        if (!isParticipant) return;

        const message = {
          sender: socket.userId,
          content: content || "",
          messageType: messageType || "text",
          fileUrl: fileUrl || "",
          fileName: fileName || "",
        };

        chat.messages.push(message);
        await chat.save();

        const populatedChat = await Chat.findById(chatId).populate(
          "messages.sender",
          "name avatar"
        );
        const newMessage =
          populatedChat.messages[populatedChat.messages.length - 1];

        io.to(chatId).emit("newMessage", {
          chatId,
          message: newMessage,
        });

        chat.participants.forEach((participantId) => {
          const participantSocketId = onlineUsers.get(
            participantId.toString()
          );
          if (
            participantSocketId &&
            participantId.toString() !== socket.userId
          ) {
            io.to(participantSocketId).emit("messageNotification", {
              chatId,
              message: newMessage,
            });
          }
        });
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("typing", (data) => {
      const { chatId } = data;
      socket.to(chatId).emit("userTyping", {
        chatId,
        userId: socket.userId,
        userName: socket.userName,
      });
    });

    socket.on("stopTyping", (data) => {
      const { chatId } = data;
      socket.to(chatId).emit("userStopTyping", {
        chatId,
        userId: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userName}`);
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = { initializeSocket, onlineUsers };
