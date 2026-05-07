import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const DoctorList = () => {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    api.get('/patients/doctors').then((response) => setDoctors(response.data.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-10">
      <section className="glass-card rounded-[2rem] border p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Doctor network</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">Choose a specialist who matches your care needs.</h1>
          </div>
          <div className="rounded-full bg-slate-100 px-5 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Trusted doctors, verified profiles
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <motion.div key={doctor._id} whileHover={{ y: -8 }} className="glass-card rounded-[2rem] border p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{doctor.user.name}</h2>
              </div>
              <div className="rounded-3xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-600/15 dark:text-cyan-200">
                ⭐ {doctor.rating?.toFixed(1) || 'N/A'}
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">Experienced in digital care delivery with fast appointment confirmation and medical follow-up.</p>
            <div className="mt-7 flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">Verified</span>
              <Link to={`/book/${doctor._id}`} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Book slot
              </Link>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default DoctorList;
