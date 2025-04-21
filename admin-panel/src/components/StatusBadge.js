import React from 'react';

const StatusBadge = ({ status }) => {
  // Define color schemes based on status
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          label: 'Pending'
        };
      case 'processing':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          label: 'Processing'
        };
      case 'shipped':
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          label: 'Shipped'
        };
      case 'delivered':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'Delivered'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          label: 'Cancelled'
        };
      case 'returned':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          label: 'Returned'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge; 