import { createContext, useState, useEffect, useContext } from "react";

import api from "../axios"; 

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      api.get("/auth/userinfo", {
        headers: { "Authorization": token },
      })
      .then(res => setUser(res.data.user))
      .catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if(res.data.status == "success")
      {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      
    } catch (error) {
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
    }
   
  };

  const register = async (username, email, password, confirm_password) => {
    try {
      const res = await api.post("/auth/register", { username, email, password, confirm_password }); 
    } catch (error) {
      console.error(error.response?.data || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
