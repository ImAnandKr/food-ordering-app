import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // <-- Correct path
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage'; // <-- Correct path
import RestaurantPage from './pages/RestaurantPage'; // <-- Correct path
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          
          {/* === Private Customer Routes === */}
          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Route>
          
          {/* === Private Admin Routes === */}
          <Route element={<PrivateRoute adminOnly={true} />}>
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </main>
    </div>
  );
}

export default App;