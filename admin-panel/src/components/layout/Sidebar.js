import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

export default function Sidebar({ isSidebarOpen }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <FiHome size={20} />,
    },
    {
      path: '/products',
      label: 'Products',
      icon: <FiShoppingBag size={20} />,
    },
    {
      path: '/orders',
      label: 'Orders',
      icon: <FiShoppingCart size={20} />,
    },
    {
      path: '/staff',
      label: 'Staff',
      icon: <FiUsers size={20} />,
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: <FiFileText size={20} />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <FiSettings size={20} />,
    },
  ];

  return (
    <div className="bg-white h-full shadow-sm flex flex-col">
      <div className="p-4 flex items-center justify-center border-b border-gray-100">
        <Link href="/dashboard" className="flex flex-shrink-0 items-center">
          <h1 className="text-xl font-bold text-primary">Vastrashahi</h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
        >
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 