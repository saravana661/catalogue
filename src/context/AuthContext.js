import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, provider = "manual") => {
    const data = { ...userData, provider, loginAt: Date.now() };
    localStorage.setItem("authUser", JSON.stringify(data));
    localStorage.setItem("isLoggedIn", "true");
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);