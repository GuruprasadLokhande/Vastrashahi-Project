import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { toast } from 'react-toastify';
import { productsAPI } from '../../services/api';
import Link from 'next/link';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Mock data (for fallback)
const mockCategories = [
  { _id: '1', parent: 'Bags', name: 'Bags' },
  { _id: '2', parent: 'Men', name: 'Men' },
  { _id: '3', parent: 'Women', name: 'Women' },
];

const mockSubcategories = {
  '1': [
    { _id: '101', name: 'HandBag' },
    { _id: '102', name: 'Ladies Purse' },
    { _id: '103', name: 'Traveling Bag' },
  ],
  '2': [
    { _id: '201', name: 'T-Shirts & Polos' },
    { _id: '202', name: 'Shirts' },
    { _id: '203', name: 'Jeans & Trousers' },
  ],
  '3': [
    { _id: '301', name: 'Sarees & Ethnic Wear' },
    { _id: '302', name: 'Kurtis & Tunics' },
    { _id: '303', name: 'Tops & T-Shirts' },
  ],
};

const mockBrands = [{ _id: '642508be253d81bc860d4d24', name: 'Vastrashahi' }];

const AddProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands] = useState(mockBrands); // Only Vastrashahi
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discountPercentage: '',
    quantity: '1',
    description: '',
    parentCategory: '',
    category: '',
    sizes: [],
    colors: [],
    status: 'in-stock',
    featured: false,
  });
  const [images, setImages] = useState([]); // Array of { file, preview }
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Available sizes and colors
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { id: 'red', label: 'Red', code: '#FF0000' },
    { id: 'blue', label: 'Blue', code: '#0000FF' },
    { id: 'green', label: 'Green', code: '#008000' },
    { id: 'black', label: 'Black', code: '#000000' },
    { id: 'white', label: 'White', code: '#FFFFFF' },
  ];

  // Fetch categories
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/show`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setCategories(data.result || mockCategories);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (isMounted) {
          setCategories(mockCategories);
          toast.error('Failed to fetch categories, using mock data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update subcategories based on parent category
  useEffect(() => {
    if (formData.parentCategory) {
      const selectedParentCategory = categories.find((cat) => cat._id === formData.parentCategory);
      if (selectedParentCategory && Array.isArray(selectedParentCategory.children)) {
        // Transform children array into the format expected by the subcategories dropdown
        const subcategoriesData = selectedParentCategory.children.map((childName, index) => ({
          _id: `${selectedParentCategory._id}-${index}`,
          name: childName
        }));
        setSubcategories(subcategoriesData);
        setFormData(prev => ({ ...prev, category: '' }));
      } else {
        setSubcategories([]);
        setFormData(prev => ({ ...prev, category: '' }));
      }
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.parentCategory, categories]);

  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      images.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle size toggle
  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Handle color toggle
  const handleColorChange = (colorId) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorId)
        ? prev.colors.filter((c) => c !== colorId)
        : [...prev.colors, colorId],
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) return 'Product title is required';
    if (!formData.price || parseFloat(formData.price) <= 0) return 'Valid price is required';
    if (formData.discountPercentage && (parseFloat(formData.discountPercentage) < 0 || parseFloat(formData.discountPercentage) > 100)) {
      return 'Discount percentage must be between 0 and 100';
    }
    if (!formData.quantity || parseInt(formData.quantity) < 1) return 'Valid quantity is required';
    if (!formData.parentCategory) return 'Parent category is required';
    if (!formData.category) return 'Subcategory is required';
    if (images.length === 0) return 'At least one image is required';
    if (!formData.description.trim() || formData.description.length < 20) return 'Description must be at least 20 characters';
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      // Upload images
      const uploadedImages = [];
      for (const { file } of images) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/cloudinary/add-img', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const result = await response.json();
        if (result.success) {
          uploadedImages.push({
            color: { name: 'Default', clrCode: '#000000' },
            img: result.data.url,
            sizes: formData.sizes,
          });
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Construct product data
      const selectedParentCategory = categories.find((cat) => cat._id === formData.parentCategory);
      const selectedSubcategory = subcategories.find((sub) => sub._id === formData.category);
      
      const productData = {
        sku: `VS-${Date.now().toString().slice(-6)}`,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discountPercentage) || 0,
        quantity: parseInt(formData.quantity),
        status: formData.status,
        featured: formData.featured,
        parent: selectedParentCategory?.parent || '',
        children: selectedSubcategory?.name || '',
        unit: 'piece',
        productType: 'fashion',
        category: {
          name: selectedSubcategory?.name || '',
          id: selectedParentCategory?._id
        },
        brand: {
          name: 'Vastrashahi',
          id: brands[0]._id,
        },
        img: uploadedImages[0]?.img || '',
        imageURLs: uploadedImages,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        tags: formData.colors,
        sizes: formData.sizes,
      };

      // Submit product
      await productsAPI.createProduct(productData);
      toast.success('Product added successfully!');
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Add New Product</h1>
          <Link href="/products" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FiX className="mr-2 -ml-1 h-5 w-5" />
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Title */}
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label htmlFor="discountPercentage" className="block text-gray-700 font-medium mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            {/* Parent Category */}
            <div>
              <label htmlFor="parentCategory" className="block text-gray-700 font-medium mb-2">
                Parent Category *
              </label>
              <select
                id="parentCategory"
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              >
                <option value="">Select Parent Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.parent || category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                Subcategory *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.parentCategory || subcategories.length === 0}
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`px-3 py-1 rounded border ${
                    formData.sizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Available Colors</label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className={`w-8 h-8 rounded-full cursor-pointer border ${
                    formData.colors.includes(color.id) ? 'border-2 border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.label}
                >
                  {formData.colors.includes(color.id) && <span className="text-white text-xs">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Product Images (Max 5) *</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map(({ preview }, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={submitting || loading}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding Product...
                </span>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default AddProduct;