// frontend/src/components/LoadingSpinner.jsx

import React from 'react';
// 1. Import the CSS module
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    // 2. Use the new styles
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;