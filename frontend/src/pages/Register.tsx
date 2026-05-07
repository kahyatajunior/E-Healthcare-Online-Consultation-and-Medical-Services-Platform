import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const payload: any = { name, email, password, role };
      if (role === 'doctor') {
        payload.specialization = specialization;
        payload.experience = experience;
      }
      const user = await register(payload);
      if (user.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/90 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-slate-900/90">
        <div className="mb-10 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Create your account</p>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Get started with modern telemedicine</h1>
          <p className="text-slate-600 dark:text-slate-300">Register as a patient or doctor to access secure digital consultations, appointment management, and medical workflows.</p>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
          </div>

          {role === 'doctor' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Specialization</label>
                <input
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Experience</label>
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </div>
            </div>
          )}

          {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">{error}</div>}

          <button type="submit" className="glow-button w-full rounded-3xl bg-sky-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-500">Sign in</Link>
        </p>
      </div>
    </motion.section>
  );
};

export default Register;
