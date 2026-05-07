import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaLaptopMedical, FaNotesMedical, FaShieldAlt, FaStar, FaUserMd } from 'react-icons/fa';

const features = [
  { icon: <FaLaptopMedical />, title: 'Virtual Consultations', description: 'Chat and video consult doctors from anywhere with secure, HIPAA-inspired sessions.' },
  { icon: <FaNotesMedical />, title: 'Prescription Management', description: 'Receive digital prescriptions, track medications, and download records instantly.' },
  { icon: <FaHeartbeat />, title: 'Smart Appointments', description: 'Book with transparent availability, get reminders, and manage follow-ups effortlessly.' },
  { icon: <FaShieldAlt />, title: 'Trusted Health Records', description: 'Secure patient data and verified medical histories for every consultation.' }
];

const doctors = [
  { name: 'Dr. Eliza Hart', specialty: 'Cardiology', rating: 4.9 },
  { name: 'Dr. Arjun Sethi', specialty: 'Pediatrics', rating: 4.8 },
  { name: 'Dr. Lina Park', specialty: 'Dermatology', rating: 4.7 }
];

const testimonials = [
  { quote: 'The booking flow is seamless and I feel comfortable consulting right from home.', author: 'Nina Patel', role: 'Patient' },
  { quote: 'The digital clinic has transformed how I manage patient schedules and notes.', author: 'Dr. Samuel Lee', role: 'Doctor' },
  { quote: 'The platform feels premium, calm, and trustworthy for everyone involved.', author: 'Alexa Owen', role: 'Patient' }
];

const LandingPage = () => {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-[rgba(255,255,255,0.7)] p-10 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl glass-card">
        <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
            <p className="rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-sky-700 dark:bg-slate-800/70 dark:text-cyan-200">
              Premium digital clinic
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-slate-950 dark:text-white md:text-6xl">
              Modern telehealth designed for safe, calm, and trusted care.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              E-Healthcare brings patients, doctors, and administrators together with elegant flows, advanced scheduling, and secure consultations.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="glow-button inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500">
                Book Consultation
              </Link>
              <Link to="/doctors" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white">
                Find Doctors
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.75 }} className="relative">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-500/20 blur-2xl" />
            <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white to-slate-100 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.1)] dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-center gap-4 rounded-3xl bg-slate-950 p-5 text-white shadow-xl">
                <FaUserMd className="h-9 w-9 text-cyan-300" />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Featured doctor</p>
                  <p className="mt-1 text-lg font-semibold">Dr. Eliza Hart</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Care quality</span>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-900/20 dark:text-cyan-200">4.9/5</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Personalized visits, expert recommendations, and secure prescriptions in one place.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Trusted by</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">1,200+</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mb-10 flex flex-col gap-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Feature-rich care</p>
          <h2 className="text-4xl font-semibold text-slate-950 dark:text-white">Designed for faster, safer, and more polished patient journeys.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <motion.article key={feature.title} whileHover={{ y: -8 }} className="glass-card rounded-[2rem] p-7 transition-transform">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-700 dark:bg-sky-400/10 dark:text-cyan-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Doctor spotlight</p>
          <h2 className="text-4xl font-semibold text-slate-950 dark:text-white">Find trusted specialists with glowing reviews.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {doctors.map((doctor) => (
            <motion.div key={doctor.name} whileHover={{ y: -6 }} className="glass-card rounded-[2rem] p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{doctor.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{doctor.specialty}</p>
                </div>
                <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-cyan-200">
                  {doctor.rating} <FaStar className="inline text-amber-400" />
                </div>
              </div>
              <p className="mt-5 text-slate-600 dark:text-slate-300">Verified specialist with friendly remote consult experience and patient-first care.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">What patients say</p>
          <h2 className="text-4xl font-semibold text-slate-950 dark:text-white">Trusted by modern families and busy professionals.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div key={index} whileHover={{ y: -8 }} className="glass-card rounded-[2rem] p-8">
              <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">“{item.quote}”</p>
              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <span>{item.author}</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700 dark:bg-sky-600/20 dark:text-cyan-200">{item.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
