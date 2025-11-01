import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom'; // <-- This line is now fixed
import toast from 'react-hot-toast';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      toast.error('You must be logged in to view your orders.');
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        // This endpoint gets orders for the user whose token is sent
        const { data } = await api.get('/orders/myorders');
        // Sort orders from newest to oldest
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserOrders();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order ID: <span className="font-normal text-gray-700">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on: {formatDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="font-semibold">Restaurant: </span>
                  {/* We populated restaurant name in the backend controller */}
                  {order.restaurantId?.name || 'Restaurant not available'}
                </div>
              
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.menuItemId} className="py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.itemName}</span>
                        <span className="text-gray-600"> x {item.quantity}</span>
                      </div>
                      <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                <span className="text-gray-600">Payment: {order.paymentMode}</span>
                <span className="text-xl font-bold text-gray-900">
                  Total: ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;