import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Table, Button, Spinner, Card, Pagination, Badge } from 'react-bootstrap';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { categoriesAPI } from '@/services/api';
import ConfirmModal from '@/components/ConfirmModal';

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Default main categories
  const defaultMainCategories = [
    { _id: 'men', name: 'Men', isMain: true },
    { _id: 'women', name: 'Women', isMain: true },
    { _id: 'bags', name: 'Bags', isMain: true }
  ];

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoriesAPI.getCategories({
        page: currentPage,
        limit: 100  // Get more to show all subcategories
      });
      
      // Handle both pagination and non-pagination API responses
      let allCategories = [];
      
      if (response.categories) {
        allCategories = response.categories;
        setTotalPages(response.totalPages || 1);
      } else if (Array.isArray(response)) {
        allCategories = response;
        setTotalPages(1);
      } else {
        allCategories = [];
        setTotalPages(1);
      }
      
      // Ensure we have the three main categories
      let hasChanged = false;
      
      const mainCategoryIds = allCategories
        .filter(cat => !cat.parentCategory)
        .map(cat => cat._id);
      
      const mainCategoryNames = allCategories
        .filter(cat => !cat.parentCategory)
        .map(cat => cat.name);
      
      // Add default categories if they don't exist
      defaultMainCategories.forEach(defaultCat => {
        if (!mainCategoryNames.includes(defaultCat.name) && !mainCategoryIds.includes(defaultCat._id)) {
          allCategories.push(defaultCat);
          hasChanged = true;
        }
      });
      
      if (hasChanged) {
        console.log('Added default categories that were missing');
      }
      
      // Initialize expanded state for main categories
      const expanded = {};
      allCategories
        .filter(cat => !cat.parentCategory || cat.isMain)
        .forEach(cat => {
          if (!expandedCategories[cat._id]) {
            expanded[cat._id] = true;
          } else {
            expanded[cat._id] = expandedCategories[cat._id];
          }
        });
      
      setExpandedCategories(expanded);
      setCategories(allCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      toast.error('Failed to load categories');
      
      // Set default categories as fallback
      setCategories(defaultMainCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoriesAPI.deleteCategory(categoryToDelete._id);
      toast.success('Category deleted successfully');
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const getSubcategories = (parentId) => {
    return categories.filter(category => 
      category.parentCategory === parentId || 
      (typeof category.parentCategory === 'object' && category.parentCategory?._id === parentId)
    );
  };
  
  const getParentCategoryName = (parentId) => {
    if (!parentId) return '';
    
    const parent = categories.find(cat => cat._id === parentId);
    return parent ? parent.name : '';
  };
  
  // Get main categories only
  const getMainCategories = () => {
    return categories.filter(category => 
      !category.parentCategory || 
      (category.isMain === true) ||
      defaultMainCategories.some(defCat => defCat.name === category.name)
    );
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Categories</h1>
        <Link href="/categories/create" passHref>
          <Button variant="primary">
            <FaPlus className="me-2" /> New Category
          </Button>
        </Link>
      </div>
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Category Management</h5>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={fetchCategories}
            >
              Refresh
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <p>This page displays your store's category hierarchy. Your store is set up with three main categories:</p>
          <div className="d-flex gap-2 mb-3">
            {defaultMainCategories.map(cat => (
              <Badge key={cat._id} bg="primary" className="p-2">
                {cat.name}
              </Badge>
            ))}
          </div>
          <p>You can add subcategories under each main category to organize your products better.</p>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <p>{error}</p>
              <Button variant="outline-primary" onClick={fetchCategories}>
                Try Again
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-3">No categories found</p>
              <Link href="/categories/create" passHref>
                <Button variant="primary">Create your first category</Button>
              </Link>
            </div>
          ) : (
            <>
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Subcategories</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Main Categories */}
                  {getMainCategories().map((category, index) => {
                    const hasSubcategories = getSubcategories(category._id).length > 0;
                    return (
                      <React.Fragment key={category._id || index}>
                        <tr className="table-light">
                          <td>{index + 1}</td>
                          <td>
                            <div 
                              className="d-flex align-items-center"
                              style={{ cursor: hasSubcategories ? 'pointer' : 'default' }}
                              onClick={hasSubcategories ? () => toggleCategoryExpand(category._id) : null}
                            >
                              {hasSubcategories ? (
                                <span className="me-2">
                                  {expandedCategories[category._id] ? (
                                    <FaChevronDown size="0.8em" />
                                  ) : (
                                    <FaChevronRight size="0.8em" />
                                  )}
                                </span>
                              ) : (
                                <span className="me-3"></span>
                              )}
                              <strong>{category.name}</strong>
                              <Badge 
                                bg="primary" 
                                className="ms-2"
                                style={{ fontSize: '0.7em' }}
                              >
                                Main
                              </Badge>
                            </div>
                          </td>
                          <td>{getSubcategories(category._id).length}</td>
                          <td>
                            {category.description ? (
                              category.description.length > 50
                                ? `${category.description.substring(0, 50)}...`
                                : category.description
                            ) : (
                              <span className="text-muted">No description</span>
                            )}
                          </td>
                          <td>{category.productCount || 0}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link
                                href={`/categories/edit/${category._id}`}
                                passHref
                              >
                                <Button size="sm" variant="outline-primary">
                                  <FaEdit />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteClick(category)}
                                disabled={defaultMainCategories.some(c => c.name === category.name)}
                                title={defaultMainCategories.some(c => c.name === category.name) ? 
                                  "Cannot delete main category" : "Delete category"}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Subcategories */}
                        {hasSubcategories && expandedCategories[category._id] && 
                          getSubcategories(category._id).map((subcat, subIndex) => (
                            <tr key={`sub-${subcat._id}`}>
                              <td></td>
                              <td>
                                <div className="ps-4">
                                  <span className="me-1">└─</span>
                                  {subcat.name}
                                </div>
                              </td>
                              <td>0</td>
                              <td>
                                {subcat.description ? (
                                  subcat.description.length > 50
                                    ? `${subcat.description.substring(0, 50)}...`
                                    : subcat.description
                                ) : (
                                  <span className="text-muted">No description</span>
                                )}
                              </td>
                              <td>{subcat.productCount || 0}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link
                                    href={`/categories/edit/${subcat._id}`}
                                    passHref
                                  >
                                    <Button size="sm" variant="outline-primary">
                                      <FaEdit />
                                    </Button>
                                  </Link>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleDeleteClick(subcat)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        body={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </DashboardLayout>
  );
};

export default ProtectedRoute(CategoriesPage); 