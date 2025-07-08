// src/api/api.js (or wherever your main api config is)

import axios from 'axios';

// 1. Create a new Axios instance with a base URL
const api = axios.create({
  baseURL: 'https://apistocktrading-production.up.railway.app/api'
});

// 2. Add a request interceptor to THIS instance
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // No need to check config.headers, it will exist on a created instance
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 3. Export the configured instance
export { api };