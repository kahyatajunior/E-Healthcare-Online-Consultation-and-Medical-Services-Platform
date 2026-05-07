import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axiosInstance';

interface AvailabilitySlot {
  date: string;
  slots: string[];
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/doctors/appointments').then((response) => setAppointments(response.data.data)).catch(console.error);
    api.get('/doctors/availability').then((response) => setAvailability(response.data.data)).catch(console.error);
  }, []);

  const upcoming = useMemo(() => appointments.slice(0, 3), [appointments]);
  const isAvailable = availability.length > 0;

  const addSlot = () => {
    if (!newDate || !newSlot.trim()) return;
    setAvailability((current) => {
      const existing = current.find((item) => item.date === newDate);
      if (existing) {
        return current.map((item) =>
          item.date === newDate ? { ...item, slots: [...new Set([...item.slots, newSlot.trim()])] } : item
        );
      }
      return [...current, { date: newDate, slots: [newSlot.trim()] }];
    });
    setNewDate('');
    setNewSlot('');
  };

  const saveAvailability = async () => {
    try {
      const response = await api.put('/doctors/availability', { availability });
      setAvailability(response.data.data);
      setMessage('Availability calendar saved.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Unable to save availability.');
    }
  };

  return (
    <div className="space-y-10">
      <section className="glass-card rounded-[2rem] border p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Doctor Workspace</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">Appointments, patients, and availability in one calm view.</h1>
          </div>
          <div className="rounded-[2rem] bg-slate-100 p-4 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
            Availability: <span className={`font-semibold ${isAvailable ? 'text-emerald-600' : 'text-rose-500'}`}>{isAvailable ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {['Today', 'This week', 'This month'].map((label, idx) => (
            <motion.div key={label} whileHover={{ y: -6 }} className="rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">{Math.round(8 + idx * 6)}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Scheduled consultations</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <motion.div whileHover={{ y: -6 }} className="glass-card rounded-[2rem] border p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Upcoming visits</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Next appointments</h2>
            </div>
            <button
              onClick={saveAvailability}
              className="rounded-full bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
            >
              Save schedule
            </button>
          </div>
          <div className="mt-8 space-y-4">
            {upcoming.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">No upcoming appointments yet.</div>
            ) : (
              upcoming.map((appointment) => (
                <div key={appointment._id} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.patient?.name || 'Patient'}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{appointment.date}</h3>
                    </div>
                    <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-600/15 dark:text-cyan-200">{appointment.timeSlot}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Status: {appointment.status}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="glass-card rounded-[2rem] border p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Availability calendar</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Manage your patient slots</h2>
          </div>
          <div className="mt-6 space-y-4">
            {availability.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No schedule configured yet. Add available dates and time slots.
              </div>
            ) : (
              availability.map((slot) => (
                <div key={slot.date} className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
                  <p className="font-semibold text-slate-900 dark:text-white">{slot.date}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slot.slots.map((time) => (
                      <span key={time} className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">{time}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-[2rem] bg-slate-950 p-6 text-white shadow-lg dark:bg-slate-800">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Add a slot</p>
            <div className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <input
                  type="text"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  placeholder="Time slot e.g. 11:00 AM"
                  className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
              <button
                onClick={addSlot}
                className="rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Add slot
              </button>
              {message && <p className="text-sm text-emerald-300">{message}</p>}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
