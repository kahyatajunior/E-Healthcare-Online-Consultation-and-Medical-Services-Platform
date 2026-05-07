import dotenv from 'dotenv';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import app from './app';
import connectDatabase from './config/db';
import User from './models/User';
import Doctor from './models/Doctor';
import Appointment from './models/Appointment';
import Message from './models/Message';

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

connectDatabase().catch((error) => {
  console.error('Database connection failed', error);
  process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
    const user = await User.findById(payload.id);
    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join_room', async (appointmentId: string) => {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        socket.emit('chat_error', { message: 'Appointment not found' });
        return;
      }

      const user = socket.data.user;
      if (user.role === 'patient' && appointment.patient.toString() !== user._id.toString()) {
        socket.emit('chat_error', { message: 'Unauthorized' });
        return;
      }

      if (user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: user._id });
        if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
          socket.emit('chat_error', { message: 'Unauthorized' });
          return;
        }
      }

      socket.join(appointmentId);
      socket.emit('joined_room', { appointmentId });
    } catch (error) {
      socket.emit('chat_error', { message: 'Unable to join room' });
    }
  });

  socket.on('chat_message', async (payload) => {
    try {
      const user = socket.data.user;
      const appointment = await Appointment.findById(payload.room);
      if (!appointment) {
        socket.emit('chat_error', { message: 'Appointment not found' });
        return;
      }

      const message = await Message.create({
        appointment: payload.room,
        sender: user._id,
        role: user.role,
        text: payload.text
      });

      const chatPayload = {
        _id: message._id,
        appointment: message.appointment,
        sender: { _id: user._id, name: user.name },
        text: message.text,
        createdAt: message.createdAt
      };

      io.to(payload.room).emit('chat_message', chatPayload);
    } catch (error) {
      socket.emit('chat_error', { message: 'Unable to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
