import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { categoriesAPI } from '@/services/api';

const CreateCategoryPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    isSubcategory: false,
    parentCategory: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default main categories
  const defaultMainCategories = [
    { _id: 'men', name: 'Men' },
    { _id: 'women', name: 'Women' },
    { _id: 'bags', name: 'Bags' }
  ];

  useEffect(() => {
    // Fetch main categories or use defaults
    const fetchMainCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getCategories();
        
        // Filter out subcategories to get only main categories
        let mainCats = [];
        
        if (Array.isArray(data) && data.length > 0) {
          const existingMainCats = data.filter(cat => !cat.parentCategory);
          
          // Check if our default categories exist
          const existingIds = existingMainCats.map(cat => cat._id);
          const existingNames = existingMainCats.map(cat => cat.name);
          
          // Add any missing default categories
          defaultMainCategories.forEach(defaultCat => {
            if (!existingNames.includes(defaultCat.name) && !existingIds.includes(defaultCat._id)) {
              mainCats.push(defaultCat);
            }
          });
          
          // Combine with existing main categories
          mainCats = [...existingMainCats, ...mainCats];
        } else {
          // If no categories exist, use defaults
          mainCats = [...defaultMainCategories];
        }
        
        setMainCategories(mainCats);
      } catch (error) {
        console.error('Error fetching main categories:', error);
        setMainCategories(defaultMainCategories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMainCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (formData.isSubcategory && !formData.parentCategory) {
      newErrors.parentCategory = 'Parent category is required for subcategories';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      
      if (formData.description) {
        formPayload.append('description', formData.description);
      }
      
      if (formData.image) {
        formPayload.append('image', formData.image);
      }
      
      // Add parent category if this is a subcategory
      if (formData.isSubcategory && formData.parentCategory) {
        formPayload.append('parentCategory', formData.parentCategory);
        // Also indicate that this is a subcategory
        formPayload.append('isSubcategory', 'true');
      }
      
      await categoriesAPI.createCategory(formPayload);
      
      toast.success('Category created successfully');
      router.push('/categories');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Create Category</h1>
        <Button
          variant="outline-secondary"
          onClick={() => router.push('/categories')}
        >
          Cancel
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                placeholder="Enter category name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="isSubcategory"
                name="isSubcategory"
                label="This is a subcategory"
                checked={formData.isSubcategory}
                onChange={handleChange}
              />
            </Form.Group>

            {formData.isSubcategory && (
              <Form.Group className="mb-3">
                <Form.Label>Parent Category <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                  isInvalid={!!errors.parentCategory}
                  disabled={loading}
                >
                  <option value="">Select a parent category</option>
                  {mainCategories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  This will create a subcategory under one of the main categories
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  {errors.parentCategory}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Category Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Recommended size: 300x300 pixels
              </Form.Text>
              
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="d-flex align-items-center"
              >
                {isSubmitting && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                )}
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
};

export default ProtectedRoute(CreateCategoryPage); 