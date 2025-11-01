import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const RestaurantPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // useParams() hook gets the 'id' from the URL (e.g., /restaurant/12345)
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        // This single endpoint fetches both restaurant and its menu
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
  }, [id]); // Re-run this effect if the 'id' in the URL changes

  const addToCartHandler = (menuItem) => {
    // 1. Get existing cart from localStorage, or create an empty array
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // --- Cart Logic: Check if cart belongs to another restaurant ---
    if (cartItems.length > 0 && cartItems[0].restaurantId.toString() !== menuItem.restaurantId.toString()) {
      // If user tries to add item from a different restaurant
      toast.error('You can only order from one restaurant at a time. Clear your cart first.');
      return; 
    }
    // ----------------------------------------------------------------
    
    // 2. Check if item already exists in cart
    const existItem = cartItems.find((x) => x.menuItemId === menuItem._id);

    if (existItem) {
      // 3. If it exists, just update the quantity
      existItem.quantity += 1;
    } else {
      // 4. If it's a new item, add it to the cart
      const cartItem = {
        menuItemId: menuItem._id,
        itemName: menuItem.itemName,
        price: menuItem.price,
        image: menuItem.image,
        quantity: 1,
        restaurantId: menuItem.restaurantId,
      };
      cartItems.push(cartItem);
    }

    // 5. Save the updated cart back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    toast.success(`${menuItem.itemName} added to cart!`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div>
      {restaurant && (
        <>
          {/* Restaurant Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-64 object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x400?text=No+Image'; }}
            />
            <div className="p-6">
              <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{restaurant.location}</p>
              <p className="text-gray-700">{restaurant.description}</p>
            </div>
          </div>

          {/* Menu Section */}
          <h2 className="text-3xl font-semibold mb-4">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.length > 0 ? (
              menu.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.itemName}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food'; }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.itemName}</h3>
                    <p className="text-gray-800 font-bold text-lg">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button
                    onClick={() => addToCartHandler(item)}
                    className="self-end bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
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