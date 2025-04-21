import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatusBadge from '../../components/StatusBadge';
import OrderStatusModal from '../../components/orders/OrderStatusModal';
import { FiArrowLeft, FiEdit, FiPrinter } from 'react-icons/fi';
import { ordersAPI } from '../../services/api';

const OrderDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // Fetch the order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await ordersAPI.getOrderById(id);
        setOrder(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please try again later.');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      
      // Update the order in the local state
      setOrder(prev => ({
        ...prev,
        status: newStatus
      }));
      
      toast.success(`Order status updated to ${newStatus}`);
      setIsStatusModalOpen(false);
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Print order
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  if (error) {
    return (
      <ProtectedRoute>
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiArrowLeft className="mr-2 -ml-1 h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  if (!order) {
    return (
      <ProtectedRoute>
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Order not found</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiArrowLeft className="mr-2 -ml-1 h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div className="flex items-center">
            <Link
              href="/orders"
              className="mr-4 text-indigo-600 hover:text-indigo-900"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.invoice || order._id?.substring(0, 8)}
            </h1>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setIsStatusModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiEdit className="mr-2 -ml-1 h-4 w-4" />
              Update Status
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPrinter className="mr-2 -ml-1 h-4 w-4" />
              Print
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.name || 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.email || 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.contact || 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
                  ₹{order.totalAmount?.toFixed(2) || 0}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.paymentMethod || 'COD'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.zipCode}</p>
                    <p>{order.country}</p>
                  </div>
                </dd>
              </div>
              {order.orderNote && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Order Note</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.orderNote}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {order.cart?.length || 0} item(s) ordered
            </p>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.cart && order.cart.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {item.img ? (
                            <div className="h-10 w-10 relative">
                              <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover rounded-md"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                          {item.size && (
                            <div className="text-sm text-gray-500">
                              Size: {item.size}
                            </div>
                          )}
                          {item.color && (
                            <div className="text-sm text-gray-500 flex items-center">
                              Color: 
                              <span 
                                className="inline-block w-3 h-3 ml-1 rounded-full border border-gray-300" 
                                style={{backgroundColor: item.color.clrCode || item.color}}
                              ></span>
                            </div>
                          )}
                          {item.category && (
                            <div className="text-sm text-gray-500">
                              Category: {item.category.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.orderQuantity || item.quantity || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{(parseFloat(item.price) * (item.orderQuantity || item.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Subtotal:
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{order.subTotal?.toFixed(2) || 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Shipping Fee:
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{order.shippingCost?.toFixed(2) || 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    Discount:
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{order.discount?.toFixed(2) || 0}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-base font-bold text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-gray-900">
                    ₹{order.totalAmount?.toFixed(2) || 0}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <OrderStatusModal
          order={order}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </ProtectedRoute>
  );
};

export default OrderDetails; 