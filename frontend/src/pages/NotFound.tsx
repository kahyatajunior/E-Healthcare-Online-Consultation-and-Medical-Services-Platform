import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="mx-auto max-w-xl rounded-[2rem] bg-white/90 p-10 text-center shadow-[0_35px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-slate-950/90">
    <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Oops</p>
    <h1 className="mt-4 text-5xl font-semibold text-slate-950 dark:text-white">404</h1>
    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">The page you are looking for doesn’t exist or has moved.</p>
    <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
      Return home
    </Link>
  </motion.div>
);

export default NotFound;
