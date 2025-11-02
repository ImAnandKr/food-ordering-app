// frontend/src/components/admin/ManageMenu.jsx

import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

// 1. Import the CSS module
import styles from './ManageMenu.module.css';

const ManageMenu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newItem, setNewItem] = useState({
    itemName: '',
    price: '',
    category: '',
    image: '',
  });

  // 1. Fetch all restaurants for the dropdown
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurantId(data[0]._id);
        }
      } catch (err) {
        toast.error('Failed to fetch restaurants');
      }
    };
    fetchRestaurants();
  }, []);

  // 2. Fetch menu items whenever the selected restaurant changes
  useEffect(() => {
    if (!selectedRestaurantId) {
      setMenuItems([]);
      return;
    }
    
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/menu/${selectedRestaurantId}`);
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch menu items');
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedRestaurantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.price || !newItem.category || !newItem.image) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const itemData = {
        ...newItem,
        restaurantId: selectedRestaurantId,
        price: parseFloat(newItem.price),
      };
      
      const { data } = await api.post('/menu', itemData);
      
      setMenuItems([data, ...menuItems]);
      toast.success('Menu item added successfully!');
      setNewItem({ itemName: '', price: '', category: '', image: '' });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add menu item');
    }
  };

  return (
    // 2. Use imported styles
    <div>
      <h2 className={styles.title}>Manage Menu</h2>

      <div className={styles.selectorGroup}>
        <label htmlFor="restaurant-select" className={styles.selectorLabel}>
          Select Restaurant
        </label>
        <select
          id="restaurant-select"
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
          className={styles.selectDropdown}
        >
          {restaurants.length === 0 ? (
            <option>Loading restaurants...</option>
          ) : (
            restaurants.map((res) => (
              <option key={res._id} value={res._id}>
                {res.name}
              </option>
            ))
          )}
        </select>
      </div>

      {selectedRestaurantId && (
        <div className={styles.grid}>
          
          <div className={styles.formContainer}>
            <h3 className={styles.formTitle}>Add New Item</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={newItem.itemName}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  step="0.01"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Category</label>
                <input
                  type="text"
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Appetizer, Main"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newItem.image}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <button
                type="submit"
                className="btn btn-secondary" /* Use global green button */
              >
                Add Item
              </button>
            </form>
          </div>

          <div className={styles.listContainer}>
            <h3 className={styles.listTitle}>Existing Menu Items</h3>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className={styles.menuList}>
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <div key={item._id} className={styles.menuItem}>
                      <img 
                        src={item.image} 
                        alt={item.itemName}
                        className={styles.menuItemImage}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food'; }}
                      />
                      <div className={styles.menuItemContent}>
                        <h4 className={styles.menuItemName}>{item.itemName}</h4>
                        <p className={styles.menuItemCategory}>{item.category}</p>
                      </div>
                      <div className={styles.menuItemPrice}>
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No menu items found for this restaurant.</p>
                )}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ManageMenu;