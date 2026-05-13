import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);  // true while we check localStorage

  // On mount — restore user from localStorage so page refreshes don't log them out
  useEffect(() => {
    const saved = authService.getCurrentUser();
    setUser(saved);
    setLoading(false);
  }, []);

  // ── login: calls POST /api/v1/auth/login ──────────────────────────────────
  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    // Backend returns flat structure — build user object from top-level fields
    const user = {
      userId: response.userId,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    setUser(user);
    return response; // return full response so LoginPage can read the role
  }, []);

  // ── register: calls POST /api/v1/auth/register ───────────────────────────
  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    const user = {
      userId: response.userId,
      username: response.username,
      email: response.email,
      role: response.role,
    };
    setUser(user);
    return response;
  }, []);

  // ── logout: clears localStorage ──────────────────────────────────────────
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => !!user, [user]);
  const hasRole         = useCallback((role) => user?.role === role, [user]);
  const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN'];
    const isAdmin = useCallback(
      () => ADMIN_ROLES.includes(user?.role),
      [user]
    );

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};