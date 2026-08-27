import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pv_token') || null);
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('pv_user');
    return cached
      ? JSON.parse(cached)
      : {
          name: 'Student User',
          email: 'student@projectvault.io',
          role: 'student',
          profile: { department: 'Computer Science', college: 'University' },
        };
  });

  const login = (userData, authToken) => {
    if (authToken) {
      localStorage.setItem('pv_token', authToken);
      setToken(authToken);
    }
    if (userData) {
      localStorage.setItem('pv_user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('pv_token');
    localStorage.removeItem('pv_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('pv_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
