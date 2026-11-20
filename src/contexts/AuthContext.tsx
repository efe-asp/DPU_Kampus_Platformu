import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getStoredUser, setStoredUser, clearStoredUser, getToken, setToken, clearToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isEnteringPortal: boolean;
  setIsEnteringPortal: (v: boolean) => void;
  isExitingPortal: boolean;
  setIsExitingPortal: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setTokenState] = useState<string | null>(getToken);
  const [isEnteringPortal, setIsEnteringPortal] = useState(false);
  const [isExitingPortal, setIsExitingPortal] = useState(false);

  useEffect(() => {
    // If user has token but no stored user, or vice versa, sync state
    const stored = getStoredUser();
    const tok = getToken();
    if (stored && tok) {
      setUser(stored);
      setTokenState(tok);
    }
  }, []);

  const login = (u: User, t: string) => {
    setUser(u);
    setTokenState(t);
    setStoredUser(u);
    setToken(t);
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    clearStoredUser();
    clearToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        isEnteringPortal,
        setIsEnteringPortal,
        isExitingPortal,
        setIsExitingPortal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
