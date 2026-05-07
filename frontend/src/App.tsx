import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorList from './pages/DoctorList';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PatientDashboard from './pages/PatientDashboard';
import Register from './pages/Register';
import AppointmentBooking from './pages/AppointmentBooking';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 }
};

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/doctor"
              element={<ProtectedRoute roles={["doctor"]}><DoctorDashboard /></ProtectedRoute>}
            />
            <Route
              path="/patient"
              element={<ProtectedRoute roles={["patient"]}><PatientDashboard /></ProtectedRoute>}
            />
            <Route
              path="/doctors"
              element={<ProtectedRoute roles={["patient"]}><DoctorList /></ProtectedRoute>}
            />
            <Route
              path="/book/:doctorId"
              element={<ProtectedRoute roles={["patient"]}><AppointmentBooking /></ProtectedRoute>}
            />
            <Route
              path="/chat"
              element={<ProtectedRoute roles={["doctor", "patient"]}><Chat /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
