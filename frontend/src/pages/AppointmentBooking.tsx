import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axiosInstance';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [availability, setAvailability] = useState<{ date: string; slots: string[] }[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!doctorId) return;
      try {
        const response = await api.get(`/patients/doctors/${doctorId}/availability`);
        const doctorAvailability = response.data.data || [];
        setAvailability(doctorAvailability);
        if (doctorAvailability.length > 0) {
          setDate(doctorAvailability[0].date);
          setTimeSlot(doctorAvailability[0].slots[0] || '');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/patients/appointments', { doctorId, date, timeSlot, notes });
      setMessage('Appointment requested successfully.');
      navigate('/patient');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="mx-auto max-w-3xl">
      <div className="glass-card rounded-[2rem] border p-8 shadow-[0_35px_90px_rgba(15,23,42,0.12)]">
        <div className="mb-8 flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Elegant scheduling</p>
          <h1 className="text-4xl font-semibold text-slate-950 dark:text-white">Book your consultation with confidence</h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">Pick a time that fits your schedule and confirm your appointment through a modern, secure booking flow.</p>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Available date</label>
              <select
                value={date}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  setDate(selectedDate);
                  const selectedDay = availability.find((item) => item.date === selectedDate);
                  if (selectedDay?.slots?.length) {
                    setTimeSlot(selectedDay.slots[0]);
                  }
                }}
                className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              >
                <option value="" disabled>Select a date</option>
                {availability.map((item) => (
                  <option key={item.date} value={item.date}>{item.date}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Available slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              >
                <option value="" disabled>Select a time</option>
                {availability
                  .find((item) => item.date === date)
                  ?.slots.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes for doctor</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {message && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">{message}</div>}

          <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl bg-slate-100 p-6 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Summary</p>
              <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">Doctor ID: {doctorId}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">You’ll receive appointment updates instantly and can chat with the doctor once confirmed.</p>
            </div>
            <button type="submit" className="glow-button rounded-3xl bg-slate-950 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-800">
              Confirm booking
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AppointmentBooking;
