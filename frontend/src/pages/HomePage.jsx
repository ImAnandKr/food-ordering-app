// frontend/src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner'; // Already converted

// 1. Import the CSS module
import styles from './HomePage.module.css';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurants');
        setLoading(false);
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    // 2. Use the global 'container' class from index.css
    <div className="container" style={{ paddingTop: '20px' }}>
      {/* 3. Use imported styles */}
      <h1 className={styles.title}>
        Discover Restaurants
      </h1>
      
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search for restaurants by name..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className={styles.grid}>
        {restaurants.length > 0 ? (
          filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className={styles.card}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className={styles.cardImage}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                />
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{restaurant.name}</h2>
                  <p className={styles.cardLocation}>{restaurant.location}</p>
                  <p className={styles.cardDescription}>
                    {restaurant.description}
                  </p>
                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    // 4. Use global styles from index.css
                    className={`btn btn-primary ${styles.cardButton}`}
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.message}>
              No restaurants found matching "{searchTerm}".
            </p>
          )
        ) : (
          <p className={styles.message}>
            No restaurants found. Admin should add some!
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;