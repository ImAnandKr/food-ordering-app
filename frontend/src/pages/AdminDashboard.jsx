// frontend/src/pages/AdminDashboard.jsx

import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// 1. Import the CSS module
import styles from './AdminDashboard.module.css';

// Import Admin components
// We will convert these next
import ManageOrders from '../components/admin/ManageOrders';
import ManageRestaurants from '../components/admin/ManageRestaurants';
import ManageMenu from '../components/admin/ManageMenu';

const AdminDashboard = () => {
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    // 2. Use the imported styles
    <div className={`container ${styles.container}`}>
      {/* 1. Admin Navigation Sidebar */}
      <nav className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Menu</h2>
        <div className={styles.navList}>
          <Link
            to="/admin/dashboard/orders"
            // 3. Dynamically set active class
            className={isActive('/admin/dashboard/orders') ? styles.navLinkActive : styles.navLink}
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/dashboard/restaurants"
            className={isActive('/admin/dashboard/restaurants') ? styles.navLinkActive : styles.navLink}
          >
            Manage Restaurants
          </Link>
          <Link
            to="/admin/dashboard/menu"
            className={isActive('/admin/dashboard/menu') ? styles.navLinkActive : styles.navLink}
          >
            Manage Menu
          </Link>
        </div>
      </nav>

      {/* 2. Admin Content Area */}
      <div className={styles.content}>
        <Routes>
          <Route path="orders" element={<ManageOrders />} />
          <Route path="restaurants" element={<ManageRestaurants />} />
          <Route path="menu" element={<ManageMenu />} />
          
          {/* Default admin page */}
          <Route index element={<ManageOrders />} /> 
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;