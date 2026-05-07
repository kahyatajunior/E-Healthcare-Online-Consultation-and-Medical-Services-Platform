import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

const getStoredUser = () => {
  const raw = localStorage.getItem('ehealth_user');
  return raw ? JSON.parse(raw) : null;
};

const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles: UserRole[] }) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
