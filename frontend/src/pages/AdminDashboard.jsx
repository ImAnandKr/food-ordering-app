import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Import all real components
import ManageRestaurants from '../components/admin/ManageRestaurants';
import ManageMenu from '../components/admin/ManageMenu';
import ManageOrders from '../components/admin/ManageOrders'; // <-- Import final component

const AdminDashboard = () => {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname.includes(path)
      ? 'bg-red-600 text-white'
      : 'text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)]">
      {/* 1. Admin Navigation Sidebar */}
      <nav className="md:w-64 bg-white shadow-md p-4 space-y-2 md:mr-6 mb-6 md:mb-0">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Admin Menu</h2>
        <Link
          to="/admin/dashboard/orders"
          className={`block w-full text-left px-4 py-2 rounded-lg ${getLinkClass('orders')}`}
        >
          Manage Orders
        </Link>
        <Link
          to="/admin/dashboard/restaurants"
          className={`block w-full text-left px-4 py-2 rounded-lg ${getLinkClass('restaurants')}`}
        >
          Manage Restaurants
        </Link>
        <Link
          to="/admin/dashboard/menu"
          className={`block w-full text-left px-4 py-2 rounded-lg ${getLinkClass('menu')}`}
        >
          Manage Menu
        </Link>
      </nav>

      {/* 2. Admin Content Area */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <Routes>
          <Route path="orders" element={<ManageOrders />} />
          <Route path="restaurants" element={<ManageRestaurants />} />
          <Route path="menu" element={<ManageMenu />} />
          
          {/* Default admin page (set to orders) */}
          <Route index element={<ManageOrders />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;