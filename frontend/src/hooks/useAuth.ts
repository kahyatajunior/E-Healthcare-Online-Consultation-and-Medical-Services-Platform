import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { User } from '../types';

const storageKey = 'ehealth_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data.data;
    localStorage.setItem('ehealth_token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ehealth_token');
    localStorage.removeItem(storageKey);
    setUser(null);
  };

  const register = async (payload: object) => {
    const response = await api.post('/auth/register', payload);
    const data = response.data.data;
    localStorage.setItem('ehealth_token', data.token);
    setUser(data);
    return data;
  };

  return { user, login, logout, register, setUser };
};
