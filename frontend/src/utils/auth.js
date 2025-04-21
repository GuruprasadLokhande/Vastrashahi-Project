import Cookies from 'js-cookie';

// Get token from cookies or localStorage
export const getToken = () => {
  // Try to get token from cookies first
  const token = Cookies.get('token');
  if (token) return token;

  // Fallback to localStorage if not in cookies
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Set token in both cookies and localStorage
export const setToken = (token) => {
  Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove token from both cookies and localStorage
export const removeToken = () => {
  Cookies.remove('token');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
}; 