import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white/90 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-slate-900/90">
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Secure access</p>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Sign in to your care workspace</h1>
          <p className="text-slate-600 dark:text-slate-300">Fast, trusted authentication for patients and doctors with secure role-based access.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="floating-input w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              required
            />
          </div>

          {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">{error}</div>}

          <button type="submit" className="glow-button w-full rounded-3xl bg-sky-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500">
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New to E-Healthcare? <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-500">Create an account</Link>
        </p>
      </div>
    </motion.section>
  );
};

export default Login;
