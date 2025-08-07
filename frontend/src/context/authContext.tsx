import React, { useState, useContext, useEffect } from "react";
import axios from "@/utils/axios";
import { getCSRFToken } from "@/utils/auth/tokens";
import type { User } from "@/utils/types";

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  loading: false,
});

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await axios.get<User>(`${API_URL}/api/user/current/`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post<User>(`${API_URL}/api/user/login/`, { username, password }, { withCredentials: true });
    setUser(res.data);
  };

  const logout = async () => {
    const csrfToken = getCSRFToken();
    await axios.post(
      `${API_URL}/api/user/logout/`,
      {},
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrfToken || "",
        },
      }
    );
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
