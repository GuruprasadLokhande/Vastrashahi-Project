import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  // Use the Next.js API proxy to avoid CORS issues
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request
      return Promise.reject({ message: error.message });
    }
  }
);

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/admin/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    // This endpoint might need to be created on the backend
    // For now, we'll just return the stored user data
    const userData = localStorage.getItem('admin');
    if (userData) {
      return JSON.parse(userData);
    }
    throw new Error('No user data found');
  },
};

// Products API functions
export const productsAPI = {
  getProducts: async (params) => {
    const response = await api.get('/product/all', { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/product/single-product/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/product/add', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/product/edit-product/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },
};

// Orders API functions
export const ordersAPI = {
  getOrders: async (params) => {
    const response = await api.get('/order/all', { params });
    return response.data;
  },
  getOrder: async (id) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/order/status/${id}`, { status });
    return response.data;
  },
};

// Dashboard API functions
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },
  getRecentOrders: async () => {
    const response = await api.get('/order/all?limit=5');
    return response.data;
  },
};

export default api; 