import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  // This is a simple way to check auth. A Context is better for complex apps.
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    // You might also want to clear cart items here
    // localStorage.removeItem('cartItems');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600">
          FoodApp
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/cart" className="text-gray-700 hover:text-red-600">
            Cart
          </Link>
          {userInfo ? (
            <>
              <Link to="/orders" className="text-gray-700 hover:text-red-600">
                My Orders
              </Link>
              {userInfo.role === 'admin' && (
                 <Link to="/admin/dashboard" className="text-blue-700 font-medium hover:text-blue-900">
                  Admin
                 </Link>
              )}
              <button
                onClick={logoutHandler}
                className="text-gray-700 hover:text-red-600"
              >
                Logout ({userInfo.name.split(' ')[0]})
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;