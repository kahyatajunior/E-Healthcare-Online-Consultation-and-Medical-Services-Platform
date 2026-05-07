import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<{ role: string; name: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('ehealth_user');
    setCurrentUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = currentUser?.role === 'admin'
    ? '/admin'
    : currentUser?.role === 'doctor'
      ? '/doctor'
      : '/patient';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_25%),var(--bg)] text-slate-900 transition-colors duration-500 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm dark:border-slate-800/70 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="text-xl font-semibold tracking-tight text-slate-950 transition hover:text-sky-700 dark:text-slate-100">
            E-Healthcare
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800">Home</Link>
            <Link to="/doctors" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800">Doctors</Link>
            {currentUser && <Link to={dashboardPath} className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800">Dashboard</Link>}
            {currentUser && <Link to="/chat" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800">Chat</Link>}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:inline">{currentUser.name}</span>
                <button onClick={handleLogout} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                  Login
                </Link>
                <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
};

export default Layout;
