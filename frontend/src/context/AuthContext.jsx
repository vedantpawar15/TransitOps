import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Raman K.',
    email: 'ram@gmail.com',
    role: 'FleetManager'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          if (data && data.user) {
            setUser(data.user);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          // Keep the mock user instead of removing token to allow testing
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasAccess = (moduleName, accessType) => {
    return true; // Bypass RBAC for local demo mode
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, loading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
