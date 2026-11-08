import { useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();
      if (!response.ok) {
        return {
          error: { message: data.message || "Неверный логин или пароль" },
        };
      }

      // Ожидаем от бэка структуру data.user и data.session (или data.token)
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

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: { message: data.message || "Ошибка регистрации" } };
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

  const signOut = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    if (token) {
      fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  return { user, token, loading, signUp, signIn, signOut };
}
