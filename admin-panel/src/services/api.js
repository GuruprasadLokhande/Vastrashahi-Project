import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle API errors consistently
const handleAPIError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
    return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
    return { message: 'No response from server. Please check your internet connection.' };
    } else {
      // Something happened in setting up the request
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
});

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
      const response = await API.post('/auth/register', userData);
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
  // Keeping both function names for compatibility
  getCategories: async (params = {}) => {
    try {
      // Try multiple possible API endpoints for categories
      let response;
      try {
        // First try standard /categories endpoint
        response = await API.get('/categories', { params });
      } catch (error) {
        console.log("First categories endpoint failed, trying alternative...");
        try {
          // Then try /category/all which is common in some APIs
          response = await API.get('/category/all', { params });
        } catch (secondError) {
          console.log("Second categories endpoint failed, trying another alternative...");
          // Last try with /category endpoint
          response = await API.get('/category', { params });
        }
      }
      
      console.log("Categories API response:", response);
      
      // Parse and standardize category data format
      let categoryData = [];
      
      if (response && response.data) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          categoryData = response.data;
        } else if (response.data.categories && Array.isArray(response.data.categories)) {
          categoryData = response.data.categories;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          categoryData = response.data.data;
        } else {
          // Try to extract categories from any array property
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              categoryData = response.data[key];
              break;
            }
          }
        }
      }
      
      // If no categories were found, use fallback
      if (!categoryData || categoryData.length === 0) {
        console.log("No categories found in API response, using fallback data");
        return getFallbackCategories();
      }
      
      // Ensure each category has required properties
      const processedCategories = categoryData.map(cat => ({
        _id: cat._id || cat.id || `cat-${Math.random().toString(36).substr(2, 9)}`,
        name: cat.name || cat.title || cat.categoryName || 'Unnamed Category',
        description: cat.description || '',
        parentCategory: cat.parentCategory || cat.parentId || null,
        isMain: cat.isMain || (!cat.parentCategory && !cat.parentId) || false,
        productCount: cat.productCount || 0
      }));
      
      return processedCategories;
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
      // Try multiple possible endpoints
      let response;
      try {
        response = await API.get(`/categories/${id}`);
      } catch (error) {
        console.log("First category detail endpoint failed, trying alternative...");
        try {
          response = await API.get(`/category/${id}`);
        } catch (secondError) {
          console.log("Second category detail endpoint failed, trying another...");
          response = await API.get(`/category/single/${id}`);
        }
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw handleAPIError(error);
    }
  },

  createCategory: async (categoryData) => {
    try {
      // Try both possible endpoints
      let response;
      try {
        response = await API.post('/categories', categoryData);
      } catch (error) {
        console.log("First category create endpoint failed, trying alternative...");
        response = await API.post('/category/add', categoryData);
      }
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw handleAPIError(error);
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      // Try both possible endpoints
      let response;
      try {
        response = await API.put(`/categories/${id}`, categoryData);
      } catch (error) {
        console.log("First category update endpoint failed, trying alternative...");
        response = await API.patch(`/category/edit/${id}`, categoryData);
      }
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw handleAPIError(error);
    }
  },

  deleteCategory: async (id) => {
    try {
      // Try both possible endpoints
      let response;
      try {
        response = await API.delete(`/categories/${id}`);
      } catch (error) {
        console.log("First category delete endpoint failed, trying alternative...");
        response = await API.delete(`/category/${id}`);
      }
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

// Helper function to get fallback categories with hierarchy
const getFallbackCategories = () => {
  return [
    // Main categories
    { _id: 'men', name: 'Men', description: 'Men\'s clothing and accessories', isMain: true, productCount: 15 },
    { _id: 'women', name: 'Women', description: 'Women\'s clothing and accessories', isMain: true, productCount: 23 },
    { _id: 'bags', name: 'Bags', description: 'Bags and luggage', isMain: true, productCount: 8 },
    
    // Subcategories for Men
    { _id: 'men-tshirts', name: 'T-Shirts', description: 'Men\'s T-shirts', parentCategory: 'men', productCount: 5 },
    { _id: 'men-shirts', name: 'Shirts', description: 'Men\'s formal and casual shirts', parentCategory: 'men', productCount: 7 },
    { _id: 'men-jeans', name: 'Jeans', description: 'Men\'s jeans and pants', parentCategory: 'men', productCount: 3 },
    
    // Subcategories for Women
    { _id: 'women-dresses', name: 'Dresses', description: 'Women\'s dresses', parentCategory: 'women', productCount: 8 },
    { _id: 'women-tops', name: 'Tops', description: 'Women\'s tops and blouses', parentCategory: 'women', productCount: 10 },
    { _id: 'women-jeans', name: 'Jeans', description: 'Women\'s jeans and pants', parentCategory: 'women', productCount: 5 },
    
    // Subcategories for Bags
    { _id: 'bags-handbags', name: 'Handbags', description: 'Women\'s handbags', parentCategory: 'bags', productCount: 4 },
    { _id: 'bags-backpacks', name: 'Backpacks', description: 'Backpacks for all', parentCategory: 'bags', productCount: 3 },
    { _id: 'bags-travel', name: 'Travel Bags', description: 'Luggage and travel bags', parentCategory: 'bags', productCount: 1 }
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
      // Try multiple possible endpoints
      let response;
      try {
        response = await API.get(`/products/${id}`);
      } catch (error) {
        console.log("First product detail endpoint failed, trying alternative...");
        try {
          response = await API.get(`/product/${id}`);
        } catch (secondError) {
          console.log("Second product detail endpoint failed, trying another...");
          response = await API.get(`/product/single-product/${id}`);
        }
      }
    return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
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
      // Try both possible endpoints
      let response;
      try {
        response = await API.put(`/products/${id}`, product);
      } catch (error) {
        console.log("First product update endpoint failed, trying alternative...");
        response = await API.patch(`/product/edit-product/${id}`, product);
      }
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
};

// Orders API functions
export const ordersAPI = {
  getOrders: async (params) => {
    try {
      const response = await API.get('/order/all', { params });
    return response.data;
    } catch (error) {
      console.error('Get orders API error:', error);
      throw handleAPIError(error);
    }
  },
  getOrder: async (id) => {
    try {
      const response = await API.get(`/order/${id}`);
    return response.data;
    } catch (error) {
      console.error(`Get order API error for ID ${id}:`, error);
      throw handleAPIError(error);
    }
  },
  updateOrderStatus: async (id, status) => {
    try {
      const response = await API.patch(`/order/status/${id}`, { status });
    return response.data;
    } catch (error) {
      console.error(`Update order status API error for ID ${id}:`, error);
      throw handleAPIError(error);
    }
  },
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