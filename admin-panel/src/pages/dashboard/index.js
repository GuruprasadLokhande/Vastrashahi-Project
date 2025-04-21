import { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentOrders from '../../components/dashboard/RecentOrders';
import { FiShoppingBag, FiUsers, FiDollarSign, FiShoppingCart, FiGrid } from 'react-icons/fi';
import ProtectedRoute from '../../components/ProtectedRoute';
import { categoriesAPI } from '../../services/api';

// Mock data for dashboard
const mockStats = [
  {
    id: 1,
    title: 'Total Sales',
    value: '₹92,648',
    icon: <FiDollarSign size={20} />,
    trend: 'up',
    trendValue: '8.2%',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Total Orders',
    value: '1,243',
    icon: <FiShoppingBag size={20} />,
    trend: 'up',
    trendValue: '5.1%',
    color: 'green'
  },
  {
    id: 3,
    title: 'New Customers',
    value: '458',
    icon: <FiUsers size={20} />,
    trend: 'down',
    trendValue: '1.5%',
    color: 'purple'
  },
  {
    id: 4,
    title: 'Product Views',
    value: '12,549',
    icon: <FiShoppingCart size={20} />,
    trend: 'up',
    trendValue: '12.3%',
    color: 'yellow'
  }
];

const mockOrders = [
  {
    id: 'ORD-8975',
    customer: 'John Doe',
    date: '2023-05-12',
    amount: '₹2,590',
    status: 'processing'
  },
  {
    id: 'ORD-8974',
    customer: 'Sarah Smith',
    date: '2023-05-11',
    amount: '₹1,250',
    status: 'delivered'
  },
  {
    id: 'ORD-8973',
    customer: 'Michael Brown',
    date: '2023-05-10',
    amount: '₹3,100',
    status: 'shipped'
  },
  {
    id: 'ORD-8972',
    customer: 'Emma Wilson',
    date: '2023-05-09',
    amount: '₹850',
    status: 'pending'
  },
  {
    id: 'ORD-8971',
    customer: 'Robert Johnson',
    date: '2023-05-08',
    amount: '₹1,750',
    status: 'cancelled'
  }
];

function Dashboard() {
  // In a real app, you would fetch this data from an API
  const [stats, setStats] = useState(mockStats);
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    // Fetch overview data
    setLoading(true);
    
    // Simulate API call for main stats
    setTimeout(() => {
      setStats(mockStats);
      setOrders(mockOrders);
      setLoading(false);
    }, 500);

    // Actually fetch categories to check loading
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);
      
      // Log the API URL being used
      console.log('Fetching categories from:', process.env.NEXT_PUBLIC_API_BASE_URL);
      
      const categoriesData = await categoriesAPI.getCategories();
      console.log('Categories loaded:', categoriesData);
      
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategoryError('Failed to load categories: ' + (error.message || 'Unknown error'));
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                trendValue={stat.trendValue}
                color={stat.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-3">
              <RecentOrders orders={orders} />
            </div>
          </div>

          {/* Category Status Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiGrid className="mr-2" />
                Category Status
              </h2>
              <button 
                onClick={fetchCategories} 
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>

            {categoryLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : categoryError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                {categoryError}
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  {categories.length > 0 
                    ? `Loaded ${categories.length} categories successfully`
                    : 'No categories found. You can create categories from the Categories menu.'}
                </p>
                
                {categories.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subcategories
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categories.slice(0, 5).map((category) => (
                          <tr key={category._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category.name || category.parent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {category.children && Array.isArray(category.children) 
                                ? category.children.length 
                                : 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                category.status === 'Show' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {category.status || 'Active'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {categories.length > 5 && (
                      <div className="mt-4 text-right">
                        <a href="/categories" className="text-blue-500 text-sm">
                          View all categories
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
} 