// frontend/src/pages/OrderHistoryPage.jsx

import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 1. Import the CSS module
import styles from './OrderHistoryPage.module.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      toast.error('You must be logged in to view your orders.');
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders/myorders');
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
    return <div className={styles.error}>{error}</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to get dynamic status style
  const getStatusClass = (status) => {
    const statusKey = status.toLowerCase().replace(/ /g, '');
    switch (statusKey) {
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      case 'outfordelivery':
        return styles.statusOutForDelivery;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'preparing':
        return styles.statusPreparing;
      case 'pending':
      default:
        return styles.statusPending;
    }
  };

  return (
    // 2. Use global 'container' class
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 className={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.emptyOrders}>
          <p className={styles.emptyMessage}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        // 3. Use imported styles
        <div className={styles.ordersContainer}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerInfo}>
                  <h2>
                    Order ID: <span>{order._id}</span>
                  </h2>
                  <p>
                    Placed on: {formatDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <div className={styles.restaurantName}>
                  {order.restaurantId?.name || 'Restaurant not available'}
                </div>
              
                <ul className={styles.itemList}>
                  {order.items.map((item) => (
                    <li key={item.menuItemId} className={styles.item}>
                      <div>
                        <span className={styles.itemName}>{item.itemName}</span>
                        <span className={styles.itemQuantity}> x {item.quantity}</span>
                      </div>
                      <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.paymentMode}>Payment: {order.paymentMode}</span>
                <span className={styles.totalAmount}>
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