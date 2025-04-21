import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Handle API errors consistently
const handleAPIError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
    console.error('No response received:', error.request);
    return { message: 'No response from server. Please check your internet connection.' };
    } else {
      // Something happened in setting up the request
    console.error('Request error:', error.message);
    return { message: error.message || 'An unexpected error occurred.' };
  }
};

// Intercept requests to add auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response interceptor caught error:', error);
    
    // Handle session expiration (401 errors)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - logging out');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
    return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  register: async (userData) => {
    try {
      const response = await API.post('/admin/register', userData);
    return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  getProfile: async () => {
    try {
      const response = await API.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async (params = {}) => {
    try {
      console.log('Fetching categories with params:', params);
      
      // First try the correct endpoint from our backend
      let response = await API.get('/category/show', { params });
      console.log('Categories API raw response:', response);
      
      // Parse response data based on our API structure
      let categoryData = [];
      
      if (response && response.data) {
        console.log('Categories response data structure:', response.data);
        
        // Handle the exact structure from our backend
        if (response.data.result && Array.isArray(response.data.result)) {
          categoryData = response.data.result;
          console.log('Found categories in result array:', categoryData.length);
        } else if (response.data.success && response.data.result && Array.isArray(response.data.result)) {
          // Sometimes it's nested under success
          categoryData = response.data.result;
          console.log('Found categories in success.result array:', categoryData.length);
        } else if (Array.isArray(response.data)) {
          categoryData = response.data;
          console.log('Response data is directly an array:', categoryData.length);
        }
      }
      
      // If categories were found, process them to a standard format
      if (categoryData.length > 0) {
        console.log('Sample category data before processing:', categoryData[0]);
        
        const processedCategories = categoryData.map(cat => ({
          _id: cat._id || `cat-${Math.random().toString(36).substr(2, 9)}`,
          name: cat.parent || cat.name || 'Unnamed Category',
          parent: cat.parent || '',
          children: cat.children || [],
          description: cat.description || '',
          status: cat.status || 'Show',
          productType: cat.productType || 'fashion',
          img: cat.img || null,
          products: cat.products || []
        }));
        
        console.log('Processed categories successfully:', processedCategories.length);
        return processedCategories;
      }
      
      // If no categories found, use fallback
      console.log('No categories found in API response, using fallback data');
      return getFallbackCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return mock data as fallback for categories
      return getFallbackCategories();
    }
  },
  
  getAllCategories: async () => {
    try {
      return await categoriesAPI.getCategories();
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw handleAPIError(error);
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await API.get(`/category/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw handleAPIError(error);
    }
  },

  createCategory: async (categoryData) => {
    try {
      // Ensure headers are set for JSON data
      const response = await API.post('/category/add', categoryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Category creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw handleAPIError(error);
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await API.patch(`/category/edit/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw handleAPIError(error);
    }
  },

  deleteCategory: async (id) => {
    try {
      // Use the correct endpoint from backend
      const response = await API.delete(`/category/delete/${id}`);
      console.log('Category deletion response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw handleAPIError(error);
    }
  },
  
  // Get subcategories for a parent category
  getSubcategories: async (parentId) => {
    try {
      const allCategories = await categoriesAPI.getCategories();
      return allCategories.filter(cat => 
        cat.parentCategory === parentId || 
        (typeof cat.parentCategory === 'object' && cat.parentCategory?._id === parentId)
      );
    } catch (error) {
      console.error(`Error fetching subcategories for ${parentId}:`, error);
      return [];
    }
  }
};

// Fallback categories if API fails
const getFallbackCategories = () => {
  return [
    {
      _id: '64200cef21162f8b15beae40',
      name: 'Bags',
      parent: 'Bags',
      children: ['HandBag', 'Ladies purchase', 'Traveling Bag'],
      productType: 'fashion',
      status: 'Show',
      products: []
    },
    {
      _id: '65f0a1b123456789abcdef01',
      name: 'Men',
      parent: 'Men',
      children: [
        'T-Shirts & Polos',
        'Shirts',
        'Jeans & Trousers',
        'Kurtas & Ethnic Wear',
        'Jackets & Hoodies'
      ],
      productType: 'fashion',
      status: 'Show',
      products: []
    },
    {
      _id: '65f0a1b223456789abcdef02',
      name: 'Women',
      parent: 'Women',
      children: [
        'Sarees & Ethnic Wear',
        'Kurtis & Tunics',
        'Tops & T-Shirts',
        'Dresses & Jumpsuits',
        'Leggings & Palazzos'
      ],
      productType: 'fashion',
      status: 'Show',
      products: []
    }
  ];
};

// Products API
export const productsAPI = {
  getProducts: async (params = {}) => {
    try {
      // Try multiple possible API endpoints to fetch products
      let response;
      try {
        // First try standard /products endpoint
        response = await API.get('/products', { params });
      } catch (error) {
        console.log("First endpoint failed, trying alternative...");
        try {
          // Then try /product/all which is common in some APIs
          response = await API.get('/product/all', { params });
        } catch (secondError) {
          console.log("Second endpoint failed, trying another alternative...");
          // Final attempt with /product endpoint
          response = await API.get('/product', { params });
        }
      }
      
      console.log("API Response for products:", response);
    return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data as fallback
      return [
        {
          _id: '1',
          title: 'Example Product 1',
          price: 1999,
          status: 'In Stock',
          stock: 10,
          category: '1',
          img: '/placeholder-product.png'
        },
        {
          _id: '2',
          title: 'Example Product 2',
          price: 2999,
          status: 'In Stock',
          stock: 5,
          category: '2',
          img: '/placeholder-product.png'
        },
        {
          _id: '3',
          title: 'Example Product 3',
          price: 3999,
          status: 'Out of Stock',
          stock: 0,
          category: '3',
          img: '/placeholder-product.png'
        }
      ];
    }
  },
  
  getProductById: async (id) => {
    try {
      console.log(`Fetching product with ID: ${id}`);
      
      // Use the correct endpoint matching our backend
      const response = await API.get(`/product/single-product/${id}`);
      console.log('Product data response:', response.data);
      
      // Process response based on our API structure
      if (response.data) {
        return response.data;
      }
      
      throw new Error('Product data not found in response');
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw handleAPIError(error);
    }
  },
  
  // Alias for getProductById to ensure compatibility with the edit page
  getProduct: async (id) => {
    try {
      return await productsAPI.getProductById(id);
    } catch (error) {
      console.error(`Error in getProduct(${id}):`, error);
      throw handleAPIError(error);
    }
  },
  
  createProduct: async (product) => {
    try {
      // Try both possible endpoints
      let response;
      try {
        response = await API.post('/products', product);
      } catch (error) {
        console.log("First product create endpoint failed, trying alternative...");
        response = await API.post('/product/add', product);
      }
    return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw handleAPIError(error);
    }
  },
  
  updateProduct: async (id, product) => {
    try {
      console.log(`Updating product with ID: ${id}`);
      console.log('Product data being sent:', product);
      
      // Use the correct endpoint matching our backend
      const response = await API.patch(`/product/edit-product/${id}`, product, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update response:', response.data);
    return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw handleAPIError(error);
    }
  },
  
  deleteProduct: async (id) => {
    try {
      // Try both possible endpoints
      let response;
      try {
        response = await API.delete(`/products/${id}`);
      } catch (error) {
        console.log("First product delete endpoint failed, trying alternative...");
        response = await API.delete(`/product/${id}`);
      }
    return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw handleAPIError(error);
    }
  },
  
  getBrands: async () => {
    try {
      // Try multiple possible API endpoints to fetch brands
      let response;
      try {
        response = await API.get('/brand');
      } catch (error) {
        console.log("First brand endpoint failed, trying alternative...");
        try {
          response = await API.get('/brands');
        } catch (secondError) {
          console.log("Second brand endpoint failed, trying another alternative...");
          response = await API.get('/brand/all');
        }
      }
      
      if (response.data?.result) {
        return response.data.result;
      } else if (response.data?.brands) {
        return response.data.brands;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      // Return mock data as fallback
      return [
        { _id: '1', name: 'Nike' },
        { _id: '2', name: 'Adidas' },
        { _id: '3', name: 'Puma' },
        { _id: '4', name: 'Levis' },
        { _id: '5', name: 'Vastrashahi' }
      ];
    }
  },

  getCategories: async () => {
    // Reuse the categoriesAPI.getCategories function
    try {
      return await categoriesAPI.getCategories();
    } catch (error) {
      console.error('Error in productsAPI.getCategories:', error);
      throw handleAPIError(error);
    }
  },
};

// Orders API
export const ordersAPI = {
  getOrders: async (params = {}) => {
    try {
      const response = await API.get('/order/orders', { params });
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Unexpected orders data format:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw handleAPIError(error);
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await API.get(`/order/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw handleAPIError(error);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await API.patch(`/order/update-status/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order status for ${orderId}:`, error);
      throw handleAPIError(error);
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await API.delete(`/order/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw handleAPIError(error);
    }
  }
};

// Dashboard API functions
export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await API.get('/admin/dashboard-stats');
    return response.data;
    } catch (error) {
      console.error('Get dashboard stats API error:', error);
      throw handleAPIError(error);
    }
  },
  getRecentOrders: async () => {
    try {
      const response = await API.get('/order/all?limit=5');
    return response.data;
    } catch (error) {
      console.error('Get recent orders API error:', error);
      throw handleAPIError(error);
    }
  },
};

export default API; 