// frontend/src/pages/RegisterPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

// 1. Import the CSS module
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await api.post('/users/register', {
        name,
        email,
        password,
        address,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Registration successful!');
      
      // Reload to update header
      navigate('/');
      window.location.reload(); 

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    // 2. Use the imported styles
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>
          Create Account
        </h1>
        <form className={styles.form} onSubmit={submitHandler}>
          
          {/* --- NAME INPUT (FIXED) --- */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.inputLabel}>
              Name
            </label>            
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          {/* --- EMAIL INPUT (FIXED) --- */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.inputLabel}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          {/* --- ADDRESS INPUT --- */}
          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.inputLabel}>
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          {/* --- PASSWORD INPUT --- */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.inputLabel}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          {/* --- CONFIRM PASSWORD INPUT --- */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.inputLabel}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary" /* Use global button style */
            style={{ marginTop: '0.5rem' }} /* Add a little space */
          >
            Register
          </button>
        </form>
        <p className={styles.linkText} style={{ marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className={styles.link}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;