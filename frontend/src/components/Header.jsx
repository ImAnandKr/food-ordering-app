// frontend/src/components/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
// 1. Import the CSS module
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    // 2. Use the imported styles
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          FoodApp
        </Link>
        <div className={styles.navLinks}>
          <Link to="/cart" className={styles.navLink}>
            Cart
          </Link>
          {userInfo ? (
            <>
              <Link to="/orders" className={styles.navLink}>
                My Orders
              </Link>
              {userInfo.role === 'admin' && (
                <Link to="/admin/dashboard" className={styles.navLink} style={{ color: '#2563eb' }}>
                  Admin
                </Link>
              )}
              <button
                onClick={logoutHandler}
                className={styles.logoutButton}
              >
                Logout ({userInfo.name.split(' ')[0]})
              </button>
            </>
          ) : (
            // 3. Use global classes from index.css for the button
            <Link
              to="/login"
              className="btn btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;