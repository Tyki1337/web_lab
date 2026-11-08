import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type AuthResult = { data?: any; error: { message: string } | null };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<AuthResult>;
  signUp: (email: string, pass: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token"),
  );
  const [loading, setLoading] = useState(false);

  const authRequest = async (
    path: string,
    email: string,
    pass: string,
    fallbackError: string,
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.message || fallbackError } };
      }

      const accessToken = data.session?.access_token || data.token;
      const userData = data.user;
      if (accessToken && userData) {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
      }
      return { data, error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Ошибка сети" } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = (email: string, pass: string) =>
    authRequest("/auth/login", email, pass, "Неверный логин или пароль");

  const signUp = (email: string, pass: string) =>
    authRequest("/auth/register", email, pass, "Ошибка регистрации");

  const signOut = async () => {
    const currentToken = token;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    if (currentToken) {
      fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}