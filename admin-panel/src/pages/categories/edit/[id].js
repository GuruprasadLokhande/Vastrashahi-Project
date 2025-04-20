import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { categoriesAPI } from '@/services/api';

const EditCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [initialImage, setInitialImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const category = await categoriesAPI.getCategoryById(id);
        
        setFormData({
          name: category.name || '',
          description: category.description || '',
          image: null
        });
        
        if (category.image) {
          setInitialImage(category.image);
          setImagePreview(category.image);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
  
  const clearImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
    setInitialImage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
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
      } else {
        formPayload.append('description', '');
      }
      
      if (formData.image) {
        formPayload.append('image', formData.image);
      }
      
      // Add a flag to indicate if the image should be removed
      if (!formData.image && !initialImage) {
        formPayload.append('removeImage', 'true');
      }
      
      await categoriesAPI.updateCategory(id, formPayload);
      
      toast.success('Category updated successfully');
      router.push('/categories');
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error(err.response?.data?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="danger">{error}</Alert>
        <div className="d-flex justify-content-end mt-3">
          <Button variant="secondary" onClick={() => router.push('/categories')}>
            Back to Categories
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Edit Category</h1>
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
                  <Button 
                    variant="link" 
                    className="text-danger p-0 ms-2 align-top"
                    onClick={clearImage}
                    type="button"
                  >
                    Remove Image
                  </Button>
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
                {isSubmitting ? 'Updating...' : 'Update Category'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  );
};

export default ProtectedRoute(EditCategoryPage); 