import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  // --- Utility Functions ---

  // Recalculate totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // You could add tax, shipping, etc. here if you wanted
  const totalPrice = itemsPrice; // For simplicity, total is just item price

  // --- Event Handlers ---

  // This function updates both the state and localStorage
  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleQuantityChange = (menuItemId, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantity to go below 1

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
    // 1. Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      toast.error('Please log in to place an order');
      navigate('/login?redirect=/cart'); // Redirect to login, then back to cart
      return;
    }

    // 2. Prepare the order payload
    const orderData = {
      restaurantId: cartItems[0].restaurantId, // All items are from the same restaurant
      items: cartItems.map(item => ({
        menuItemId: item.menuItemId,
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentMode: 'COD', // Defaulting to Cash on Delivery
    };

    try {
      // 3. Send the order to the backend (Authorization header is auto-attached by api.js)
      await api.post('/orders', orderData);
      
      toast.success('Order placed successfully!');
      
      // 4. Clear the cart
      setCartItems([]);
      localStorage.removeItem('cartItems');
      
      // 5. Redirect to order history
      navigate('/orders');

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cart Items List (Left Side) */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.menuItemId} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                <img 
                  src={item.image} 
                  alt={item.itemName} 
                  className="w-20 h-20 object-cover rounded-md"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Food'; }}
                />
                <div className="flex-1 mx-4">
                  <h2 className="text-lg font-semibold">{item.itemName}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleQuantityChange(item.menuItemId, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.menuItemId, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <div className="ml-4 font-bold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.menuItemId)}
                  className="ml-4 text-red-500 hover:text-red-700 font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary (Right Side) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold border-b pb-4 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Price</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                {/* You could add more lines here for tax, delivery, etc. */}
                <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                  <span>Total Price</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={placeOrderHandler}
                className="w-full mt-6 bg-green-600 text-white text-lg font-medium px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;