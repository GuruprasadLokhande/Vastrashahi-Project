import { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentOrders from '../../components/dashboard/RecentOrders';
import { FiShoppingBag, FiUsers, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import ProtectedRoute from '../../components/ProtectedRoute';

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

  useEffect(() => {
    // Here you would fetch real data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <RecentOrders orders={orders} />
            </div>
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