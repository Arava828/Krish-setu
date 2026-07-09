import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('krishiUser');
    const token = localStorage.getItem('krishiToken');
    if (stored && token) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('krishiToken', res.data.token);
    localStorage.setItem('krishiUser', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(res.data.message);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('krishiToken', res.data.token);
    localStorage.setItem('krishiUser', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(res.data.message);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('krishiToken');
    localStorage.removeItem('krishiUser');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);