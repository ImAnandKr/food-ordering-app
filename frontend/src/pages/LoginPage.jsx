// frontend/src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

// 1. Import the CSS module
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Logged in successfully!');
      
      // Reload to update header (a context would be better, but this works)
      navigate('/');
      window.location.reload(); 

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    // 2. Use the imported styles
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>
          Sign In
        </h1>
        <form className={styles.form} onSubmit={submitHandler}>
          <div className={styles.formGroup}>
            <label
              htmlFor="email"
              className={styles.inputLabel}
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="password"
              className={styles.inputLabel}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary" /* Use global button style */
          >
            Login
          </button>
        </form>
        <p className={styles.linkText} style={{ marginTop: '1.5rem' }}>
          New customer?{' '}
          <Link
            to="/register"
            className={styles.link}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;