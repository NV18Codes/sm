// src/api/userApi.js

import { api } from './api'; // Assuming your configured axios instance is exported from here

// const BASE_URL = 'https://apistocktrading-production.up.railway.app/api/users/me';

/**
 * Fetches the connected broker profile, including portfolio and holdings.
 */
export const fetchBrokerProfile = () => {
  return api.get(`/users/me/broker/profile`);
};

/**
 * Clears the user's connected broker details.
 * Note: The backend route is a DELETE route.
 */
export const clearBrokerProfile = () => {
  return api.delete(`/users/me/broker/clear`);
};

// You would also have getOrderHistory and getTradeHistory here
// For example:
export const getOrderHistory = () => {
    return api.get(`/users/me/broker/orders`); // Assuming this is the correct endpoint
};

export const getTradeHistory = () => {
    return api.get(`/users/me/broker/trades`);
};