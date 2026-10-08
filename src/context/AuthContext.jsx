import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ now SAFE

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

 const login = async (email, password) => {
  const res = await API.post("/users/login", { email, password });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("role", res.data.role);
  localStorage.setItem("uniqueId", res.data.uniqueId);

  const profileRes = await API.get("/users/me");
  setUser(profileRes.data);

  return res.data; // 👈 IMPORTANT
};


  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
