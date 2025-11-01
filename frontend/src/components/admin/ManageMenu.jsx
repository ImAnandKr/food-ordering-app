import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../LoadingSpinner';

const ManageMenu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for the "Add New Item" form
  const [newItem, setNewItem] = useState({
    itemName: '',
    price: '',
    category: '',
    image: '', // Using URL for simplicity
  });

  // 1. Fetch all restaurants for the dropdown
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
        // Automatically select the first restaurant
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
      setMenuItems([]); // Clear menu if no restaurant is selected
      return;
    }
    
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // This is the public route to get a menu
        const { data } = await api.get(`/menu/${selectedRestaurantId}`);
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch menu items');
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedRestaurantId]); // Dependency array

  // --- Event Handlers ---

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
        restaurantId: selectedRestaurantId, // Attach the selected restaurant ID
        price: parseFloat(newItem.price),  // Ensure price is a number
      };
      
      const { data } = await api.post('/menu', itemData); // Admin token is auto-attached
      
      setMenuItems([data, ...menuItems]); // Add new item to the list
      toast.success('Menu item added successfully!');
      
      // Reset form
      setNewItem({ itemName: '', price: '', category: '', image: '' });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add menu item');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Menu</h2>

      {/* 1. Restaurant Selector Dropdown */}
      <div className="mb-6">
        <label htmlFor="restaurant-select" className="block text-lg font-medium mb-2">
          Select Restaurant
        </label>
        <select
          id="restaurant-select"
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. "Add New Item" Form */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold mb-3">Add New Item</h3>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
              <div>
                <label className="block mb-1 font-medium">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={newItem.itemName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Appetizer, Main, Dessert"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newItem.image}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Item
              </button>
            </form>
          </div>

          {/* 3. "Existing Menu Items" List */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-3">Existing Menu Items</h3>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-3">
                {menuItems.length > 0 ? (
                  menuItems.map((item) => (
                    <div key={item._id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                      <img 
                        src={item.image} 
                        alt={item.itemName}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food'; }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.itemName}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className="text-lg font-bold">
                        ${item.price.toFixed(2)}
                      </div>
                      {/* Add Edit/Delete buttons here later */}
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