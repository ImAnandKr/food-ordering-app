

import axios from 'axios';

const API = axios.create({
  // Change this line back to the production variable
  baseURL: import.meta.env.VITE_API_URL, 
});

// ... (rest of the file is the same)

// ... (the rest of the file stays the same)
// Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
  // Check if localStorage has userInfo
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default API;