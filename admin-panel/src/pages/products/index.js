import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { FiEdit, FiTrash2, FiPlusCircle, FiSearch, FiChevronDown, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { productsAPI, categoriesAPI } from '../../services/api';
import Link from 'next/link';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [productsByCategory, setProductsByCategory] = useState({});
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Group products by category when products or categories change
  useEffect(() => {
    organizeProductsByCategory();
  }, [products, categories]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productsAPI.getProducts();
      console.log('API Response for products:', data);
      
      // Debug response structure
      if (data) {
        console.log('Data type:', typeof data);
        console.log('Data keys:', Object.keys(data));
        if (Array.isArray(data)) {
          console.log('Data is an array with length:', data.length);
          if (data.length > 0) {
            console.log('First item sample:', data[0]);
          }
        }
      }
      
      // Handle different API response structures
      let productsList = [];
      
      if (!data) {
        console.warn('No data returned from API');
      } else if (data.products && Array.isArray(data.products)) {
        // Format: { products: [...] }
        productsList = data.products;
        console.log('Found products array in data.products');
      } else if (data.data && Array.isArray(data.data)) {
        // Format: { data: [...] }
        productsList = data.data;
        console.log('Found products array in data.data');
      } else if (data.productList && Array.isArray(data.productList)) {
        // Format: { productList: [...] }
        productsList = data.productList;
        console.log('Found products array in data.productList');
      } else if (data.payload && Array.isArray(data.payload)) {
        // Format: { payload: [...] }
        productsList = data.payload;
        console.log('Found products array in data.payload');
      } else if (Array.isArray(data)) {
        // Format: [...]
        productsList = data;
        console.log('Data is directly an array of products');
      } else if (typeof data === 'object') {
        // Try to find any array property that might contain products
        for (const key in data) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            if (data[key][0].title || data[key][0].name || data[key][0].product) {
              productsList = data[key];
              console.log(`Found products array in data.${key}`);
              break;
            }
          }
        }
      }
      
      // If we still don't have products after all that, log a warning
      if (productsList.length === 0) {
        console.warn('No products found in API response');
      } else {
        console.log(`Successfully parsed ${productsList.length} products`);
        // Debug the first product to verify structure
        if (productsList.length > 0) {
          console.log('Sample product:', productsList[0]);
        }
      }
      
      console.log('Setting products state with:', productsList.length, 'products');
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Try to fetch real categories from the API
      const response = await categoriesAPI.getCategories();
      console.log('API Response for categories:', response);
      
      // Debug the response structure
      if (response) {
        console.log('Categories response type:', typeof response);
        console.log('Categories response keys:', Object.keys(response));
        if (Array.isArray(response)) {
          console.log('Categories is an array with length:', response.length);
          if (response.length > 0) {
            console.log('First category sample:', response[0]);
          }
        }
      }
      
      let categoryData = [];
      
      // Handle different API response structures
      if (!response) {
        console.warn('No data returned from categories API');
      } else if (response.categories && Array.isArray(response.categories)) {
        // Format: { categories: [...] }
        categoryData = response.categories;
        console.log('Found categories array in response.categories');
      } else if (response.data && Array.isArray(response.data)) {
        // Format: { data: [...] }
        categoryData = response.data;
        console.log('Found categories array in response.data');
      } else if (response.categoryList && Array.isArray(response.categoryList)) {
        // Format: { categoryList: [...] }
        categoryData = response.categoryList;
        console.log('Found categories array in response.categoryList');
      } else if (response.payload && Array.isArray(response.payload)) {
        // Format: { payload: [...] }
        categoryData = response.payload;
        console.log('Found categories array in response.payload');
      } else if (Array.isArray(response)) {
        // Format: [...]
        categoryData = response;
        console.log('Response is directly an array of categories');
      } else if (typeof response === 'object') {
        // Try to find any array property that might contain categories
        for (const key in response) {
          if (Array.isArray(response[key]) && response[key].length > 0) {
            if (response[key][0].name || response[key][0].category) {
              categoryData = response[key];
              console.log(`Found categories array in response.${key}`);
              break;
            }
          }
        }
      }
      
      if (categoryData.length === 0) {
        console.warn('No categories found in API response');
      } else {
        console.log(`Successfully parsed ${categoryData.length} categories`);
        // Debug the first category to verify structure
        if (categoryData.length > 0) {
          console.log('Sample category:', categoryData[0]);
        }
      }
      
      // Normalize category data to ensure all categories have a name
      const normalizedCategories = categoryData.map(cat => {
        // Ensure each category has a valid name property
        const name = cat.name || cat.categoryName || cat.title || `Category ${cat._id}`;
        
        return {
          ...cat,
          name: name  // Always provide a name
        };
      });
      
      // Sort categories alphabetically for better organization
      normalizedCategories.sort((a, b) => {
        // Default categories always come first
        const isDefaultA = ['Men', 'Women', 'Bags'].includes(a.name);
        const isDefaultB = ['Men', 'Women', 'Bags'].includes(b.name);
        
        if (isDefaultA && !isDefaultB) return -1;
        if (!isDefaultA && isDefaultB) return 1;
        
        // Otherwise sort alphabetically
        return a.name.localeCompare(b.name);
      });
      
      console.log('Setting categories with:', normalizedCategories.length, 'normalized categories');
      setCategories(normalizedCategories);
      
      // Initialize all categories as expanded
      const expanded = {};
      normalizedCategories.forEach(cat => {
        expanded[cat._id] = true;
      });
      setExpandedCategories(expanded);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const organizeProductsByCategory = () => {
    console.log('Organizing products by category:', products.length, 'products,', categories.length, 'categories');
    
    if (products.length === 0 || categories.length === 0) {
      console.log('No products or categories to organize');
      return;
    }
    
    const grouped = {};
    
    // Initialize all categories with empty arrays
    categories.forEach(category => {
      grouped[category._id] = [];
    });
    
    // Initialize uncategorized array
    grouped['uncategorized'] = [];
    
    // Group products by category
    products.forEach(product => {
      let categoryId = 'uncategorized';
      
      // Handle different product category data structures
      if (product.category) {
        if (typeof product.category === 'object' && product.category !== null) {
          categoryId = product.category.id || product.category._id || 'uncategorized';
        } else if (typeof product.category === 'string') {
          categoryId = product.category;
        }
      }
      
      if (grouped[categoryId]) {
        grouped[categoryId].push(product);
      } else {
        // For products with categories not in our list
        grouped['uncategorized'].push(product);
      }
    });
    
    console.log('Products grouped by category:', grouped);
    
    // Add an "Uncategorized" category if there are any uncategorized products
    if (grouped['uncategorized'] && grouped['uncategorized'].length > 0) {
      // Check if we already have an uncategorized category
      if (!categories.find(cat => cat._id === 'uncategorized')) {
        setCategories(prev => [...prev, { _id: 'uncategorized', name: 'Uncategorized' }]);
        
        // Initialize uncategorized category as expanded
        setExpandedCategories(prev => ({
          ...prev,
          'uncategorized': true
        }));
      }
    }
    
    setProductsByCategory(grouped);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(id);
        toast.success('Product deleted successfully');
        // Refresh the product list
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    
    console.log(`Selected category ID: ${categoryId}`);
    setSelectedCategory(categoryId);
    
    // Filter products based on selected category
    if (categoryId) {
      fetchProducts(categoryId);
    } else {
      // If no category selected, show all products
      fetchProducts();
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Filter products based on search term
  const getFilteredProducts = (products) => {
    if (!products || !Array.isArray(products)) return [];
    
    return products.filter(product => {
      if (!product) return false;
      const title = product.title || '';
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // Get categories to display based on filters
  const getCategoriesToDisplay = () => {
    if (!categories || categories.length === 0) return [];
    
    if (selectedCategory) {
      return categories.filter(cat => cat._id === selectedCategory);
    }
    return categories;
  };

  // Get total product count for a category
  const getCategoryProductCount = (categoryId) => {
    if (!productsByCategory) return 0;
    
    const categoryProducts = productsByCategory[categoryId] || [];
    const filteredCount = getFilteredProducts(categoryProducts).length;
    return filteredCount;
  };

  const refreshData = () => {
    fetchProducts();
    fetchCategories();
  };

  // Check if there are any products to display across all categories
  const hasProducts = () => {
    if (!productsByCategory || Object.keys(productsByCategory).length === 0) {
      return false;
    }
    
    return Object.values(productsByCategory).some(catProducts => 
      Array.isArray(catProducts) && getFilteredProducts(catProducts).length > 0
    );
  };

  const getCategoryNameById = (categoryId) => {
    if (!categoryId) return '';
    
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) return `Category ${categoryId.substring(0, 4)}...`;
    
    // Get name from the category with multiple fallbacks
    const categoryName = category.name || category.categoryName || category.title || `Category ${categoryId.substring(0, 4)}...`;
    
    // If it's a subcategory, show parent category name
    if (category.parentCategory) {
      const parentCategory = categories.find(cat => cat._id === category.parentCategory);
      if (!parentCategory) return categoryName;
      
      const parentName = parentCategory.name || parentCategory.categoryName || parentCategory.title || 'Parent';
      return `${parentName} › ${categoryName}`;
    }
    
    return categoryName;
  };

  // Get category ID by name
  const getCategoryIdByName = (categoryName) => {
    if (!categoryName) return '';
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category._id : '';
  };

  // Get all subcategories for a parent category
  const getSubcategories = (parentId) => {
    if (!categories || categories.length === 0) return [];
    return categories.filter(category => 
      category.parentCategory === parentId || 
      (typeof category.parentCategory === 'object' && category.parentCategory?._id === parentId)
    );
  };
  
  // Get main categories only
  const getMainCategories = () => {
    if (!categories || categories.length === 0) return [];
    return categories.filter(category => 
      !category.parentCategory || 
      category.isMain === true
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Products</h1>
        <div className="flex space-x-3">
          <button 
            onClick={refreshData}
            className="btn btn-outline inline-flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        <Link 
          href="/products/add" 
          className="btn btn-primary inline-flex items-center"
        >
          <FiPlusCircle className="mr-2" />
            Add Product
        </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex items-center">
            <FiAlertCircle className="mr-2" />
            <p>{error}</p>
          </div>
          <p className="mt-2 text-sm">Try refreshing the page or check your API connection.</p>
        </div>
      )}

      <div className="card mb-6 p-4">
        <div className="mb-4 flex flex-col md:flex-row items-end gap-4">
          <div className="relative flex-1">
            <label className="text-sm mb-1 font-medium block">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                style={{ height: '38px' }}
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="text-sm mb-1 font-medium block">Category</div>
            <div className="relative">
              <select
                id="category-select"
                name="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                style={{ 
                  display: 'block', 
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  height: '38px',
                  zIndex: 1,
                  minWidth: '160px'
                }}
              >
                <option value="">All Categories</option>
                
                {/* Main categories */}
                {categories && categories.length > 0 && getMainCategories().map(category => (
                  <option 
                    key={category._id} 
                    value={category._id}
                    style={{
                      fontWeight: 'bold',
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    {category.name || category.categoryName || category.title || `Category ${category._id.substring(0, 4)}...`}
                  </option>
                ))}
                
                {/* Then subcategories grouped under main */}
                {categories && categories.length > 0 && getMainCategories().map(mainCat => {
                  const subcategories = getSubcategories(mainCat._id);
                  if (subcategories.length === 0) return null;
                  
                  const mainCatName = mainCat.name || mainCat.categoryName || mainCat.title || `Category ${mainCat._id.substring(0, 4)}...`;
                  
                  return (
                    <optgroup key={`group-${mainCat._id}`} label={mainCatName}>
                      {subcategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>
                          {subCat.name || subCat.categoryName || subCat.title || `Subcategory ${subCat._id.substring(0, 4)}...`}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          {getCategoriesToDisplay().length > 0 && hasProducts() ? (
            getCategoriesToDisplay().map(category => {
              const categoryProducts = getFilteredProducts(productsByCategory[category._id] || []);
              
              if (categoryProducts.length === 0) return null;
              
              return (
                <div key={category._id} className="mb-8">
                  <div 
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-4 cursor-pointer"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {category.name || category.categoryName || category.title || `Category ${category._id}`}
                      </h2>
                      <span className="ml-3 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                        {getCategoryProductCount(category._id)} products
                      </span>
                    </div>
                    <span>
                      {expandedCategories[category._id] ? (
                        <FiChevronDown className="text-gray-600" />
                      ) : (
                        <FiChevronRight className="text-gray-600" />
                      )}
                    </span>
                  </div>
                  
                  {expandedCategories[category._id] && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
                          {categoryProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-16 h-16 relative">
                        <img
                                    src={product.image || product.img || product.imageURLs?.[0]?.img || '/placeholder-product.png'}
                                    alt={product.title || 'Product'}
                          className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-product.png';
                                    }}
                        />
                      </div>
                    </td>
                              <td className="px-4 py-3 font-medium">{product.title || 'Unnamed Product'}</td>
                              <td className="px-4 py-3">₹{product.price || 0}</td>
                              <td className="px-4 py-3">{product.stock || product.quantity || 0}</td>
                    <td className="px-4 py-3">
                      <span 
                        className={`status-badge ${
                                    (product.status === 'In Stock' || product.status === 'in-stock') 
                            ? 'status-delivered' 
                            : 'status-cancelled'
                        }`}
                      >
                                  {product.status || 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/products/edit/${product._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                          ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
            })
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {searchTerm ? 'No products match your search' : 'No products found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding a new product or check your API connection.'}
              </p>
              <div className="mt-6">
                <Link
                  href="/products/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiPlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add a Product
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  );
} 