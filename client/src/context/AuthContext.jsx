import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const checkUser = async () => {
                  try {
                        const response = await api.get('/current_user');
                        setUser(response.data.user);
                  } catch (error) {
                        // Only log errors that are not 401 (expected when not logged in)
                        if (error.response?.status !== 401) {
                              console.error("Failed to fetch user", error);
                        }
                  } finally {
                        setLoading(false);
                  }
            };
            checkUser();
      }, []);

      const login = async (username, password) => {
            const response = await api.post('/login', { username, password });
            setUser(response.data.user);
            return response.data;
      };

      const signup = async (username, email, password, requestAdmin) => {
            const response = await api.post('/signup', { username, email, password, requestAdmin });
            // Don't set user here, wait for OTP verification
            return response.data;
      };

      const logout = async () => {
            await api.get('/logout');
            setUser(null);
      };

      return (
            <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
                  {!loading && children}
            </AuthContext.Provider>
      );
};

export const useAuth = () => useContext(AuthContext);
