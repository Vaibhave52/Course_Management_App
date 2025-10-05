// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const storedAuth = sessionStorage.getItem("auth");
    return storedAuth
      ? JSON.parse(storedAuth)
      : { token: null, email: null, role: null, name: null }; // ✅ not null
  });

  const login = (data) => {
    setAuth(data);
    sessionStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = () => {
    setAuth({ token: null, email: null, role: null, name: null });
    sessionStorage.removeItem("auth");
    // window.location.href = "/"; // redirect to login
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
