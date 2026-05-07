import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axiosInstance';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ userCount: 0, doctorCount: 0, appointmentCount: 0, prescriptionCount: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/admin/stats')
      .then((response) => setStats(response.data.data))
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const cards = useMemo(() => [
    { label: 'Total users', value: stats.userCount, accent: 'from-sky-500 to-cyan-400' },
    { label: 'Active doctors', value: stats.doctorCount, accent: 'from-emerald-500 to-teal-400' },
    { label: 'Appointments', value: stats.appointmentCount, accent: 'from-violet-500 to-indigo-400' },
    { label: 'Prescriptions', value: stats.prescriptionCount, accent: 'from-fuchsia-500 to-pink-400' }
  ], [stats]);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Admin Overview</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">Operational insights and health metrics</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">An executive dashboard designed to help administrators monitor patient volume, doctor activity, and platform performance.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => (
          <motion.div key={item.label} whileHover={{ y: -6 }} className="glass-card rounded-[2rem] p-6">
            <div className={`inline-flex rounded-3xl bg-gradient-to-r ${item.accent} px-4 py-2 text-sm font-semibold text-white`}>{item.label}</div>
            <div className="mt-6 text-4xl font-semibold text-slate-950 dark:text-white">{loaded ? item.value : '—'}</div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Live platform metrics with realtime updates based on user activity.</p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <motion.div whileHover={{ y: -6 }} className="glass-card rounded-[2rem] border p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Consultation volume</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">Appointment Trend</h2>
            </div>
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-600/15 dark:text-cyan-200">Updated</span>
          </div>
          <div className="mt-10 space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{day}</span>
                  <span>{Math.round(20 + index * 8)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className={`h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400`} style={{ width: `${50 + index * 6}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="glass-card rounded-[2rem] border p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Recent activity</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Notifications</h2>
          <div className="mt-6 space-y-4">
            {['New doctor onboarding request', 'Appointment volume increased 14%', 'Security review completed'].map((item, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="glass-card rounded-[2rem] border p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Data table</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Patient signups</h2>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Visits</th>
                <th className="px-6 py-4">Last appointment</th>
              </tr>
            </thead>
            <tbody>
              {['Ava S.', 'Noah J.', 'Mia R.', 'Leo C.'].map((patient, idx) => (
                <tr key={patient} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50 dark:bg-slate-900'}>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{patient}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Active</td>
                  <td className="px-6 py-4">{3 + idx}</td>
                  <td className="px-6 py-4">{['Today', 'Yesterday', '2 days ago', '3 days ago'][idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
