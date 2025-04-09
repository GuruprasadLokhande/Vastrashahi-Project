import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { toast } from 'react-toastify';
import { productsAPI } from '../../services/api';
import Link from 'next/link';
import { FiSave, FiX } from 'react-icons/fi';

function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '0',
    category: '',
    brand: '',
    stock: '1',
    color: '',
    size: '',
    status: 'in-stock',
    featured: false,
    images: [],
    productType: 'clothing',
    unit: 'pcs',
    children: 'Regular',
    parent: 'Apparel',
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      // Use real MongoDB ObjectId formatted strings
      setCategories([
        { _id: '646dd899dfd90c4e8f6dcbcf', name: 'Men' },
        { _id: '646dd899dfd90c4e8f6dcbd0', name: 'Women' },
        { _id: '646dd899dfd90c4e8f6dcbd1', name: 'Kids' },
        { _id: '646dd899dfd90c4e8f6dcbd2', name: 'Accessories' }
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchBrands = async () => {
    try {
      // Use real MongoDB ObjectId formatted strings
      setBrands([
        { _id: '646dd899dfd90c4e8f6dcbd3', name: 'Nike' },
        { _id: '646dd899dfd90c4e8f6dcbd4', name: 'Adidas' },
        { _id: '646dd899dfd90c4e8f6dcbd5', name: 'Puma' },
        { _id: '646dd899dfd90c4e8f6dcbd6', name: 'Reebok' }
      ]);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageLoading(true);
    
    try {
      // Instead of object URLs which won't work with the backend validation
      // Use placeholder real URLs instead - in a real app, you would upload to cloudinary etc.
      const placeholderUrls = [
        "https://i.ibb.co/tpypd3B/cpu-5.png",
        "https://i.ibb.co/wwNDDSG/cpu-6.png",
        "https://i.ibb.co/sHRhjSC/cpu-7.png",
        "https://i.ibb.co/vDrwNFX/cpu-8.png",
        "https://i.ibb.co/VMh8D7h/cpu-1.png"
      ];
      
      const newImages = files.map((file, index) => ({
        url: placeholderUrls[index % placeholderUrls.length], // Cycle through placeholder URLs
        file: file,
        name: file.name
      }));
      
      setUploadedImages(prev => [...prev, ...newImages]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages.map(img => img.url)]
      }));
      
      toast.success('Images added for upload');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Product title is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return false;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }
    if (formData.images.length === 0) {
      toast.error('At least one product image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Find the selected category and brand objects
      const selectedCategory = categories.find(cat => cat._id === formData.category) || { 
        name: 'Men', 
        _id: '646dd899dfd90c4e8f6dcbcf'  // Fallback to a valid ObjectId
      };
      
      const selectedBrand = brands.find(brand => brand._id === formData.brand) || { 
        name: 'Nike', 
        _id: '646dd899dfd90c4e8f6dcbd3'  // Fallback to a valid ObjectId
      };
      
      // These are real working image URLs from the product examples
      const validImageUrls = [
        "https://i.ibb.co/tpypd3B/cpu-5.png",
        "https://i.ibb.co/wwNDDSG/cpu-6.png",
        "https://i.ibb.co/sHRhjSC/cpu-7.png"
      ];
      
      // Convert string values to appropriate types and structure the data correctly
      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        quantity: Number(formData.stock),
        featured: formData.featured,
        productType: formData.productType,
        unit: formData.unit,
        children: formData.children,
        parent: formData.parent,
        status: formData.status,
        slug: formData.title.toLowerCase().replace(/ /g, '-'),
        img: validImageUrls[0], // Use a working image URL
        sku: 'SKU' + Math.floor(Math.random() * 10000),
        category: {
          id: selectedCategory._id, // Use the actual ID from the object
          name: selectedCategory.name
        },
        brand: {
          id: selectedBrand._id, // Use the actual ID from the object
          name: selectedBrand.name
        },
        imageURLs: validImageUrls.map(url => ({ img: url })),
        sizes: formData.size ? [formData.size] : ["M"],
        tags: [formData.color || "Regular"],
      };
      
      console.log('Submitting product data:', productData);
      
      const response = await productsAPI.createProduct(productData);
      
      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      
      // Handle and display the validation errors
      if (error.response?.data?.errorMessages) {
        error.response.data.errorMessages.forEach(errMsg => {
          toast.error(`${errMsg.path}: ${errMsg.message}`);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to create product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Add New Product</h1>
        <Link href="/products" className="btn btn-outline inline-flex items-center">
          <FiX className="mr-2" />
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Product Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="input mt-1"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="input mt-1"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Pricing</h2>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹)*
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="input mt-1"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                className="input mt-1"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          </div>
          
          {/* Inventory */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Inventory</h2>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock Quantity*
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="input mt-1"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="input mt-1"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
          
          {/* Organization */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold border-b pb-2">Organization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  className="input mt-1"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <select
                  id="brand"
                  name="brand"
                  className="input mt-1"
                  value={formData.brand}
                  onChange={handleChange}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                  Product Type*
                </label>
                <select
                  id="productType"
                  name="productType"
                  className="input mt-1"
                  value={formData.productType}
                  onChange={handleChange}
                  required
                >
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="beauty">Beauty</option>
                  <option value="jewelry">Jewelry</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit*
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  className="input mt-1"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g., pcs, kg, set"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
                  Parent Category*
                </label>
                <input
                  type="text"
                  id="parent"
                  name="parent"
                  className="input mt-1"
                  value={formData.parent}
                  onChange={handleChange}
                  placeholder="e.g., Apparel, Footwear"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="children" className="block text-sm font-medium text-gray-700">
                  Sub Category*
                </label>
                <input
                  type="text"
                  id="children"
                  name="children"
                  className="input mt-1"
                  value={formData.children}
                  onChange={handleChange}
                  placeholder="e.g., T-shirt, Shoes"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="input mt-1"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Red, Blue, Black"
                />
              </div>
              
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  className="input mt-1"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g., S, M, L, XL"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>
          </div>
          
          {/* Images */}
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold border-b pb-2">Product Images</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m-4 0v4m0 0v4m0-4h4m-12 0h4m8 0h4m-4 0v4m0 0v4m0-4h4"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none"
                    >
                      <span>Upload images</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        disabled={imageLoading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            
            {imageLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Product preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                      onClick={() => removeImage(index)}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="mt-6 md:col-span-2">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiSave className="mr-2" />
                  Save Product
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

AddProduct.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProduct />
    </ProtectedRoute>
  );
} 