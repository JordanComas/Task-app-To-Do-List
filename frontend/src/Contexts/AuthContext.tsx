import React, { createContext, useContext, useEffect, useState } from "react";

// Theme type with your CSS variables
export type Theme = {
  "--primary-bg": string;
  "--primary-text": string;
  "--secondary-bg": string;
  "--button-bg": string;
  "--button-text": string;
  "--button-hover-bg": string;
  "--button-hover-text": string;
};

// User type includes optional theme
type User = { id: string; email: string; name: string; theme?: Theme } | null;

interface AuthContextType {
  token: string | null;
  user: User;
  login: (token: string, user: User) => void;
  logout: () => void;
  setTheme: (theme: Theme) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // Apply theme to CSS variables
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  // Apply theme if user has one
  useEffect(() => {
    if (user?.theme) applyTheme(user.theme);
  }, [user]);

  // Sync token with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Sync user with localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Listen for changes in other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setToken(e.newValue);
      if (e.key === "user") setUser(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    if (newUser?.theme) applyTheme(newUser.theme);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const setTheme = (theme: Theme) => {
    if (user) {
      const updatedUser = { ...user, theme };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      applyTheme(theme);
      // Optionally, you can persist theme to backend via /update-profile
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
