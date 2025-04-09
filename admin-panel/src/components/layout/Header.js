import { useState } from 'react';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user } = useAuth();
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left side: Menu toggle and title */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-900 hidden md:block">
            Vastrashahi
          </h1>
        </div>

        {/* Right side: Notifications and user */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Notifications"
            >
              <FiBell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {/* Sample notifications */}
                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm text-gray-800 font-medium">New order received</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm text-gray-800 font-medium">Product out of stock</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm text-gray-800 font-medium">New customer registered</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-primary hover:text-primary/90 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name || 'Admin User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
} 