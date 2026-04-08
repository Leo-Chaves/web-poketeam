"use client";

import {
  clearSession,
  getStoredToken,
  getStoredUser,
  persistSession,
} from "@/lib/auth-storage";
import * as authApi from "@/services/auth-api";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    setUser(storedUser);

    authApi
      .fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        persistSession(storedToken, currentUser);
      })
      .catch(() => {
        clearSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function handleLogin(payload: LoginPayload) {
    const response = await authApi.login(payload);
    persistSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }

  async function handleRegister(payload: RegisterPayload) {
    const response = await authApi.register(payload);
    persistSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
