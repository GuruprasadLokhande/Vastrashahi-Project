import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on first load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('admin');
        
        if (token && storedUser) {
          try {
            // Set user from stored data
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('Attempting login with:', { email, password });
      
      // Call login API
      const response = await authAPI.login(email, password);
      
      console.log('Login response:', response);
      
      // Check if login was successful and we have a token
      if (response && response.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        
        // Store user data
        const userData = {
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          image: response.image
        };
        
        localStorage.setItem('admin', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Login successful!');
        return true;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      console.log('Registering with data:', userData);
      
      // Call register API
      const response = await authAPI.register(userData);
      
      console.log('Registration response:', response);
      
      // Check if registration was successful and we have a token
      if (response && response.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        
        // Store user data
        const userData = {
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role
        };
        
        localStorage.setItem('admin', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Registration successful!');
        return true;
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Get error message from response if available
      const errorMessage = error.message || 'Registration failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setUser(null);
    router.push('/login');
    toast.success('Logged out successfully');
  };

  // Value to be provided by context
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 