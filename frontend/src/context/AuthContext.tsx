import { createContext, useState, useEffect, useCallback, useRef, useContext, type ReactNode, type Context } from 'react';
import { authApi } from '../services/api.ts';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  fetchMe: () => Promise<void>;
}

export const AuthContext: Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authApi.me();
      if (mountedRef.current) setUser(res.data);
    } catch {
      localStorage.removeItem('token');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchMe();
    return () => { mountedRef.current = false; };
  }, [fetchMe]);

  const login = (data: { token: string; user: User }) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};