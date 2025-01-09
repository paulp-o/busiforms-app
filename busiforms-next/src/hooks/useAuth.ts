import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface User {
  email: string;
  id: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const email = getCookie("email");
    const id = getCookie("userId");

    if (email && id) {
      setUser({ email: String(email), id: String(id) });
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });

      if (response.data.user) {
        const userData = response.data.user;
        setCookie("email", userData.email, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        setCookie("userId", userData.id, { maxAge: 60 * 60 * 24 * 7 });
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    deleteCookie("email");
    deleteCookie("userId");
    setUser(null);
  };

  return { user, loading, login, logout };
}
