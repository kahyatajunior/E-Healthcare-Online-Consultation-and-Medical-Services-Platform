import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaUserMd, FaUser } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axiosInstance';

interface AppointmentOption {
  _id: string;
  date: string;
  timeSlot: string;
  doctor?: { user?: { name: string } };
}

interface ChatMessage {
  _id: string;
  sender: { _id: string; name: string };
  text: string;
  createdAt: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentOption[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Select an appointment to start');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const endpoint = user?.role === 'doctor' ? '/doctors/appointments' : '/patients/appointments';
        const response = await api.get(endpoint || '/patients/appointments');
        setAppointments(response.data.data || []);
        if (response.data.data.length) {
          setSelectedAppointment(response.data.data[0]._id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, [user]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL as string).replace(/\/api$/, '') : 'http://localhost:5000';
    const socket = io(apiUrl, {
      auth: { token: localStorage.getItem('ehealth_token') }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('Connected');
    });

    socket.on('joined_room', () => {
      setStatus('Joined appointment room');
    });

    socket.on('chat_message', (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
    });

    socket.on('chat_error', (error: { message: string }) => {
      setStatus(error.message);
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!selectedAppointment || !socketRef.current) return;

    const socket = socketRef.current;
    socket.emit('join_room', selectedAppointment);

    const loadMessages = async () => {
      try {
        const response = await api.get(`/chat/${selectedAppointment}/messages`);
        setMessages(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadMessages();
  }, [selectedAppointment]);

  const sendMessage = () => {
    if (!draft.trim() || !selectedAppointment || !socketRef.current) return;

    socketRef.current.emit('chat_message', { room: selectedAppointment, text: draft.trim() });
    setDraft('');
  };

  const activeDoctor = appointments.find((appointment) => appointment._id === selectedAppointment)?.doctor?.user?.name || 'your doctor';

  return (
    <div className="space-y-8">
      <header className="glass-card flex flex-col gap-4 rounded-[2rem] border p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-700 dark:bg-sky-400/10 dark:text-cyan-200">
            <FaUserMd className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Live consultation</p>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Chat with {activeDoctor}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p>
          </div>
        </div>
        <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
          Secure appointment messaging
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card flex min-h-[520px] flex-col rounded-[2rem] border p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Consultation chat</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Messages are persisted and synchronized for the appointment session.</p>
            </div>
            <select
              className="rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={selectedAppointment}
              onChange={(event) => setSelectedAppointment(event.target.value)}
            >
              {appointments.map((appointment) => (
                <option key={appointment._id} value={appointment._id}>
                  {appointment.date} · {appointment.timeSlot} — {appointment.doctor?.user?.name || 'Doctor'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {messages.map((message) => {
              const isOwnMessage = message.sender.name === user?.name;
              return (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[85%] rounded-3xl p-4 ${
                    isOwnMessage
                      ? 'bg-sky-600 text-white self-end'
                      : 'bg-slate-100 text-slate-900 self-start dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {isOwnMessage ? 'You' : message.sender.name}
                  </div>
                  <p className="mt-2 text-sm leading-6">{message.text}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              className="floating-input flex-1 rounded-3xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <button
              onClick={sendMessage}
              className="glow-button inline-flex h-12 items-center justify-center rounded-3xl bg-slate-950 px-5 text-white transition hover:bg-slate-800"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass-card rounded-[2rem] border p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Appointment details</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Active appointment</p>
                <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{selectedAppointment ? `#${selectedAppointment.slice(-6)}` : 'None selected'}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{status}</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-[2rem] border p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Connectivity</p>
            <div className="mt-5 flex items-center gap-3 rounded-3xl bg-slate-950/90 p-4 text-white">
              <FaUser className="h-6 w-6 text-cyan-300" />
              <div>
                <p className="text-sm">Real-time chat</p>
                <p className="text-xs text-slate-300">All messages are saved to your consultation session.</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Chat;
