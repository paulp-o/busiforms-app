import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface User {
  email: string;
  id: string;
  username: string;
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
      try {
        const response = await axios.get("http://localhost:3001/api/users/" + email);
        const userData = response.data;
        setUser({ email: userData.email, id: userData.id, username: userData.name });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
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
    } catch {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await axios.post("http://localhost:3001/api/users/register", {
        email,
        password,
        username: username || email.split("@")[0],
      });

      if (response.data.id && response.data.email) {
        const userData = response.data;
        setCookie("email", userData.email, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        setCookie("userId", userData.id, { maxAge: 60 * 60 * 24 * 7 });
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    deleteCookie("email");
    deleteCookie("userId");
    deleteCookie("username");
    setUser(null);
  };

  return { user, loading, login, logout, register };
}
