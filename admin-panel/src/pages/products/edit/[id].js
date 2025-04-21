import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { toast } from 'react-toastify';
import { productsAPI } from '../../../services/api';
import Link from 'next/link';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';

function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '0',
    quantity: '1',
    category: '',
    parent: '',
    children: '',
    brand: '',
    status: 'in-stock',
    featured: false,
    images: [],
    startDate: '', // Added to match backend expectation
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      fetchCategories();
      fetchBrands();
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      setFetchLoading(true);
      console.log(`Fetching product with ID: ${productId}`);

      const product = await productsAPI.getProduct(productId);
      console.log('Product data received:', product);

      if (!product) {
        throw new Error('No product data returned from API');
      }

      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        quantity: product.quantity?.toString() || '1',
        category: product.category?.id || product.category || '',
        parent: product.parent || '',
        children: product.children || '',
        brand: product.brand?.id || product.brand || '0',
        status: product.status || 'in-stock',
        featured: product.featured || false,
        images: product.imageURLs?.map((img) => img.img) || product.images || [],
        startDate: product.startDate || new Date().toISOString(), // Default to current date if not present
      });

      setUploadedImages(
        (product.imageURLs || []).map((imgObj, index) => ({
          url: imgObj.img || '',
          name: `Product image ${index + 1}`,
        }))
      );

      toast.success('Product loaded successfully');
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details: ' + (error.message || 'Unknown error'));
      setTimeout(() => router.push('/products'), 2000);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await productsAPI.getCategories();
      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        console.warn('No categories found, using fallback data');
        setCategories([
          { _id: '1', name: 'Men', parent: 'Men' },
          { _id: '2', name: 'Women', parent: 'Women' },
          { _id: '3', name: 'Bags', parent: 'Bags' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setCategories([
        { _id: '1', name: 'Men', parent: 'Men' },
        { _id: '2', name: 'Women', parent: 'Women' },
        { _id: '3', name: 'Bags', parent: 'Bags' },
      ]);
    }
  };

  const fetchBrands = async () => {
    try {
      const brandsData = await productsAPI.getBrands();
      if (Array.isArray(brandsData) && brandsData.length > 0) {
        setBrands(brandsData);
      } else {
        console.warn('No brands found, using fallback data');
        setBrands([{ _id: '0', name: 'Vastrashahi' }]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
      setBrands([{ _id: '0', name: 'Vastrashahi' }]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formDataImg = new FormData();
        formDataImg.append('image', file);

        const response = await fetch('/api/cloudinary/add-img', {
          method: 'POST',
          body: formDataImg,
        });

        if (!response.ok) throw new Error('Failed to upload image');
        const result = await response.json();
        if (result.success) {
          return {
            url: result.data.url,
            name: file.name,
          };
        }
        throw new Error('Image upload failed');
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...newImages]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages.map((img) => img.url)],
      }));

      toast.success(`${newImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images: ' + error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const selectedCategory = categories.find((c) => c._id === formData.category);
      const categoryName = selectedCategory ? selectedCategory.parent || selectedCategory.name : '';

      const imageURLs = uploadedImages.map((img) => ({
        color: { name: '', clrCode: '' },
        img: img.url,
        sizes: [],
      }));

      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        quantity: Number(formData.quantity),
        status: formData.status,
        featured: formData.featured,
        parent: formData.parent,
        children: formData.children,
        category: {
          name: categoryName,
          id: formData.category,
        },
        brand: {
          name: 'Vastrashahi',
          id: formData.brand || '0',
        },
        productType: 'fashion',
        img: uploadedImages[0]?.url || formData.images[0] || '',
        imageURLs: imageURLs.length > 0 ? imageURLs : undefined,
        startDate: formData.startDate || new Date().toISOString(), // Added startDate
      };

      console.log('Updating product data:', productData);
      console.log('Updating product ID:', id);

      const response = await productsAPI.updateProduct(id, productData);
      console.log('Update response:', response);

      if (response?.success) {
        toast.success('Product updated successfully!');
        router.push('/products');
      } else {
        throw new Error(response?.message || 'Update failed: Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setLoading(true);
        await productsAPI.deleteProduct(id);
        toast.success('Product deleted successfully');
        router.push('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.message || 'Failed to delete product');
        setLoading(false);
      }
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Edit Product</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              className="btn btn-danger inline-flex items-center"
              disabled={loading}
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
            <Link href="/products" className="btn btn-outline inline-flex items-center">
              <FiX className="mr-2" />
              Cancel
            </Link>
          </div>
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
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Stock Quantity*
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="input mt-1"
                  value={formData.quantity}
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
                  <option value="coming-soon">Coming Soon</option>
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
                    {categories.map((category) => (
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
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
                    Parent Category
                  </label>
                  <input
                    type="text"
                    id="parent"
                    name="parent"
                    className="input mt-1"
                    value={formData.parent}
                    onChange={handleChange}
                    placeholder="e.g., Men, Women"
                  />
                </div>

                <div>
                  <label htmlFor="children" className="block text-sm font-medium text-gray-700">
                    Children Categories
                  </label>
                  <input
                    type="text"
                    id="children"
                    name="children"
                    className="input mt-1"
                    value={formData.children}
                    onChange={handleChange}
                    placeholder="e.g., Sneakers, Boots"
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
                <label className="block text-sm font-medium text-gray-700">Upload Images</label>
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
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <EditProduct />
    </ProtectedRoute>
  );
}