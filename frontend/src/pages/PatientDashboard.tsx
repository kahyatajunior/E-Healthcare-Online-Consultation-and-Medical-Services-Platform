import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axiosInstance';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/patients/appointments').then((response) => setAppointments(response.data.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-10">
      <section className="glass-card rounded-[2rem] border p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Patient hub</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">A calm home for your medical journey.</h1>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Track upcoming visits, access medical history, and instantly connect with trusted doctors.</p>
          </div>
          <Link to="/doctors" className="glow-button rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Browse specialists
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <motion.div whileHover={{ y: -6 }} className="glass-card rounded-[2rem] border p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Upcoming appointments</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Today and tomorrow</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">Safe care</span>
          </div>
          <div className="mt-8 space-y-4">
            {appointments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                No upcoming appointments yet. Browse doctors to get started.
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.doctor?.specialization}</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{appointment.date} · {appointment.timeSlot}</h3>
                    </div>
                    <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-600/15 dark:text-cyan-200">{appointment.status}</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Doctor: {appointment.doctor?.user?.name || 'Assigned soon'}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.aside whileHover={{ y: -6 }} className="glass-card rounded-[2rem] border p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Health summary</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Medical history</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {['Prescription refill ready', 'New lab result available', 'Next consultation in 2 days'].map((item, idx) => (
              <div key={idx} className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
                <p className="text-sm text-slate-600 dark:text-slate-300">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-sky-500/10 p-5 text-sm text-slate-700 dark:bg-sky-500/15 dark:text-cyan-200">
            <p className="font-semibold">Secure by design</p>
            <p className="mt-2">All consultations and records are protected with role-based access and encryption-ready architecture.</p>
          </div>
        </motion.aside>
      </section>
    </div>
  );
};

export default PatientDashboard;
