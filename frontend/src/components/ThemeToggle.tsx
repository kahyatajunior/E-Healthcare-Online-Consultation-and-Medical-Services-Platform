import { motion } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-900 shadow-sm transition-colors duration-200 hover:bg-white/20 dark:text-slate-100"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </motion.button>
  );
};

export default ThemeToggle;
