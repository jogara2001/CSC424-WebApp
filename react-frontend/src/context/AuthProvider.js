import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
export const TOKEN_KEY = "google_token"
export const INVALID_TOKEN = ""

const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
  
    const [token, setToken] = useState(document.cookie.replace("token=", ""));
  
    const handleLogin = async (user, password) => {
      const { data } = await axios.post('https://localhost:8000/account/login', {
        userId: user,
        password: password
      })
      const token = data.user.token
      if(token) {
        document.cookie = `token=${token}`
        setToken(token);
        navigate("/landing");
        return true
      } else {
        return false
      }
    };

  const handleLogout = () => {
    document.cookie = `token=`
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={{ value }}>
      {children}
    </AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);