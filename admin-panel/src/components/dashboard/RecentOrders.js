import Link from 'next/link';

const statusColors = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Orders</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3">
                    {order.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${statusColors[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <Link href="/orders" className="text-primary hover:underline">
          View all orders
        </Link>
      </div>
    </div>
  );
};

export default RecentOrders; 