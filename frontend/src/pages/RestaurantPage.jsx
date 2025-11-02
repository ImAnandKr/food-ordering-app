// frontend/src/pages/RestaurantPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

// 1. Import the CSS module
import styles from './RestaurantPage.module.css';

const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data.restaurant);
        setMenu(data.menu);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch details');
        setLoading(false);
        console.error(err);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  const addToCartHandler = (menuItem) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length > 0 && cartItems[0].restaurantId.toString() !== menuItem.restaurantId.toString()) {
      toast.error('You can only order from one restaurant at a time. Clear your cart first.');
      return; 
    }
    
    const existItem = cartItems.find((x) => x.menuItemId === menuItem._id);

    if (existItem) {
      existItem.quantity += 1;
    } else {
      cartItems.push({
        menuItemId: menuItem._id,
        itemName: menuItem.itemName,
        price: menuItem.price,
        image: menuItem.image,
        quantity: 1,
        restaurantId: menuItem.restaurantId,
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    toast.success(`${menuItem.itemName} added to cart!`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    // 2. Use the global 'container' class
    <div className="container" style={{ paddingTop: '20px' }}>
      {restaurant && (
        <>
          {/* Restaurant Header */}
          <div className={styles.restaurantHeader}>
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className={styles.headerImage}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x400?text=No+Image'; }}
            />
            <div className={styles.headerContent}>
              <h1 className={styles.title}>{restaurant.name}</h1>
              <p className={styles.location}>{restaurant.location}</p>
              <p className={styles.description}>{restaurant.description}</p>
            </div>
          </div>

          {/* Menu Section */}
          <h2 className={styles.menuTitle}>Menu</h2>
          <div className={styles.menuGrid}>
            {menu.length > 0 ? (
              menu.map((item) => (
                <div key={item._id} className={styles.menuItem}>
                  <img 
                    src={item.image} 
                    alt={item.itemName}
                    className={styles.menuItemImage}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food'; }}
                  />
                  <div className={styles.menuItemContent}>
                    <h3 className={styles.menuItemName}>{item.itemName}</h3>
                    <p className={styles.menuItemPrice}>${item.price.toFixed(2)}</p>
                    <p className={styles.menuItemCategory}>{item.category}</p>
                  </div>
                  <button
                    onClick={() => addToCartHandler(item)}
                    // 3. Use global button classes from index.css
                    className={`btn btn-secondary ${styles.addButton}`}
                  >
                    Add
                  </button>
                </div>
              ))
            ) : (
              <p>This restaurant has no menu items yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantPage;