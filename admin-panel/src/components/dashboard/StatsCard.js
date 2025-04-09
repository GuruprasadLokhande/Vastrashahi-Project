import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendValue, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const trendIcon = trend === 'up' ? '↑' : '↓';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-full ${colorClasses[color || 'blue']}`}>
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        {trendValue && (
          <div className="flex items-center mt-2 text-sm">
            <span className={trendColor}>
              {trendIcon} {trendValue}%
            </span>
            <span className="text-gray-500 ml-1">vs. last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 