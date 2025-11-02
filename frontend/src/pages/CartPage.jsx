// frontend/src/pages/CartPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

// 1. Import the CSS module
import styles from './CartPage.module.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPrice = itemsPrice;

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleQuantityChange = (menuItemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is zero, remove the item
      handleRemoveItem(menuItemId);
      return;
    };

    const updatedItems = cartItems.map((item) =>
      item.menuItemId === menuItemId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedItems);
  };

  const handleRemoveItem = (menuItemId) => {
    const updatedItems = cartItems.filter((item) => item.menuItemId !== menuItemId);
    updateCart(updatedItems);
    toast.success('Item removed from cart');
  };

  const placeOrderHandler = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      toast.error('Please log in to place an order');
      navigate('/login?redirect=/cart');
      return;
    }

    const orderData = {
      restaurantId: cartItems[0].restaurantId,
      items: cartItems.map(item => ({
        menuItemId: item.menuItemId,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentMode: 'COD',
    };

    try {
      await api.post('/orders', orderData);
      toast.success('Order placed successfully!');
      setCartItems([]);
      localStorage.removeItem('cartItems');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    // 2. Use global 'container' class
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 className={styles.title}>Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p className={styles.emptyMessage}>Your cart is empty.</p>
          <Link to="/" className={`btn btn-primary ${styles.emptyLink}`}>
            Go Shopping
          </Link>
        </div>
      ) : (
        // 3. Use imported styles
        <div className={styles.grid}>
          
          {/* Cart Items List */}
          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item.menuItemId} className={styles.cartItem}>
                <img 
                  src={item.image} 
                  alt={item.itemName} 
                  className={styles.itemImage}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food'; }}
                />
                <div className={styles.itemInfo}>
                  <h2 className={styles.itemName}>{item.itemName}</h2>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                </div>
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                    className={styles.quantityButton}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                </div>
                <div className={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.menuItemId)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>
              Order Summary
            </h2>
            <div className={styles.summaryLine}>
              <span className={styles.summaryLabel}>Items Price</span>
              <span className={styles.summaryValue}>${itemsPrice.toFixed(2)}</span>
            </div>
            {/* You could add more lines here for tax, delivery, etc. */}
            <div className={styles.summaryTotal}>
              <span>Total Price</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrderHandler}
              // 4. Use global and local classes
              className={`btn btn-secondary ${styles.placeOrderButton}`}
              disabled={cartItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;