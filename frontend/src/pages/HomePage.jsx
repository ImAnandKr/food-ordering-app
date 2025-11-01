import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]); // This is the "master list"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Add new state for the search term ---
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/restaurants');
        setRestaurants(data); // We only set the master list once
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurants');
        setLoading(false);
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  // --- 2. Create the filtered list ---
  // This logic runs every time 'searchTerm' or 'restaurants' changes
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Discover Restaurants
      </h1>
      
      {/* --- 3. Add the search input bar --- */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search for restaurants by name..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* --- 4. Render the filtered list --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          
          // Check if the *filtered* list has items
          filteredRestaurants.length > 0 ? (
            
            // Map over the *filtered* list
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'; }}
                />
                <div className="p-4">
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">{restaurant.name}</h2>
                  <p className="text-gray-600 mb-2">{restaurant.location}</p>
                  <p className="text-gray-700 mb-4 h-20 overflow-hidden text-ellipsis">
                    {restaurant.description}
                  </p>
                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="inline-block w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // Show this if the filter finds no matches
            <p className="col-span-full text-center text-gray-600 text-lg">
              No restaurants found matching "{searchTerm}".
            </p>
          )
        ) : (
          // Show this if there are no restaurants in the database
          <p className="col-span-full text-center text-gray-600 text-lg">
            No restaurants found. Admin should add some!
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;