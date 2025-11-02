// frontend/src/components/admin/ManageRestaurants.jsx

import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

// 1. Import the CSS module
import styles from './ManageRestaurants.module.css';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
  });

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
      }
    };
    fetchRestaurants();
  }, []);

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name || !newRestaurant.description || !newRestaurant.location || !newRestaurant.image) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const { data } = await api.post('/restaurants', newRestaurant);
      setRestaurants([data, ...restaurants]);
      toast.success('Restaurant added successfully!');
      setShowModal(false);
      setNewRestaurant({ name: '', description: '', location: '', image: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add restaurant');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Restaurants</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-secondary" // Use global green button
        >
          + Add New Restaurant
        </button>
      </div>

      {/* Restaurant List Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td>
                  <div className={styles.restaurantCell}>
                    <img 
                      className={styles.restaurantImage}
                      src={restaurant.image} 
                      alt={restaurant.name}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                    />
                    <span>{restaurant.name}</span>
                  </div>
                </td>
                <td>{restaurant.location}</td>
                <td className={styles.descriptionCell}>{restaurant.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* "Add New" Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add New Restaurant</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newRestaurant.name}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Description</label>
                <textarea
                  name="description"
                  value={newRestaurant.description}
                  onChange={handleInputChange}
                  className={styles.textareaField}
                  rows="3"
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newRestaurant.location}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newRestaurant.image}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`btn ${styles.btnCancel}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary" // Use global green button
                >
                  Save Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRestaurants;