import axios from 'axios';

// Add a request interceptor to attach the token automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.url && config.url.startsWith('https://apistocktrading-production.up.railway.app/api')) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;  
  },
  (error) => Promise.reject(error)
);

// Fetch option expiries for a given underlying
export const fetchOptionExpiries = async (underlying = 'NIFTY') => {
  try {
    const url = `https://apistocktrading-production.up.railway.app/api/market-data/option-expiries/${underlying}`;
    const response = await axios.get(url);
    // Accept both { data: [...] } and [...]
    if (Array.isArray(response.data)) {
      return { success: true, data: response.data };
    }
    if (response.data && Array.isArray(response.data.data)) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [], error: 'Invalid expiry data format from API' };
  } catch (error) {
    console.error('Error fetching option expiries:', error);
    // Handle both 404 and 403 errors with fallback data
    if (error.response && (error.response.status === 404 || error.response.status === 403)) {
      console.log(`Option expiries endpoint not available (${error.response.status}), using fallback data`);
      // Return fallback expiries if endpoint doesn't exist or is forbidden
      return { 
        success: true, 
        data: ['10JUL2025', '17JUL2025', '24JUL2025', '31JUL2025', '07AUG2025'] 
      };
    }
    return { success: false, data: [], error: error.message };
  }
};

// Fetch option chain data
export const fetchOptionChain = async (underlying = 'NIFTY', expiry = '10JUL2025') => {
    try {
        const url = `https://apistocktrading-production.up.railway.app/api/market-data/option-chain?underlying=${underlying}&expiry=${expiry}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching option chain:', error);
        if (error.response && (error.response.status === 404 || error.response.status === 403)) {
          console.log(`Option chain endpoint not available (${error.response.status}), using fallback data`);
          // Return fallback option chain data if endpoint doesn't exist or is forbidden
          const fallbackData = generateFallbackOptionChain(underlying, expiry);
          return { success: true, data: fallbackData };
        }
        return { success: false, data: [], error: error.message };
    }
};

// Fetch available underlyings
export const fetchUnderlyings = async () => {
  try {
    const url = 'https://apistocktrading-production.up.railway.app/api/market-data/option-underlyings';
    const response = await axios.get(url);
    // Accept both { data: [...] } and [...]
    if (Array.isArray(response.data)) {
      return { success: true, data: response.data };
    }
    if (response.data && Array.isArray(response.data.data)) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [], error: 'Invalid underlyings data format from API' };
  } catch (error) {
    console.error('Error fetching underlyings:', error);
    // Handle both 404 and 403 errors with fallback data
    if (error.response && (error.response.status === 404 || error.response.status === 403)) {
      console.log(`Underlyings endpoint not available (${error.response.status}), using fallback data`);
      // Return fallback underlyings if endpoint doesn't exist or is forbidden
      return { 
        success: true, 
        data: ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'] 
      };
    }
    return { success: false, data: [], error: error.message };
  }
};

// Generate fallback option chain data
const generateFallbackOptionChain = (underlying, expiry) => {
  const basePrice = underlying === 'NIFTY' ? 22000 : underlying === 'BANKNIFTY' ? 48000 : 20000;
  const strikes = [];
  
  // Generate strikes around the base price
  for (let i = -10; i <= 10; i++) {
    const strikePrice = basePrice + (i * 100);
    strikes.push({
      strikePrice: strikePrice,
      CE: {
        token: `${underlying}${expiry}${strikePrice}CE`,
        tradingSymbol: `${underlying}${expiry}${strikePrice}CE`,
        ltp: (Math.random() * 200 + 50).toFixed(2),
        oi: Math.floor(Math.random() * 10000 + 1000),
        lastPrice: (Math.random() * 200 + 50).toFixed(2),
        openInterest: Math.floor(Math.random() * 10000 + 1000)
      },
      PE: {
        token: `${underlying}${expiry}${strikePrice}PE`,
        tradingSymbol: `${underlying}${expiry}${strikePrice}PE`,
        ltp: (Math.random() * 200 + 50).toFixed(2),
        oi: Math.floor(Math.random() * 10000 + 1000),
        lastPrice: (Math.random() * 200 + 50).toFixed(2),
        openInterest: Math.floor(Math.random() * 10000 + 1000)
      }
    });
  }
  
  return strikes;
};

// Place a trade order (admin)
export const placeTradeOrder = async (orderData) => {
    try {
        const url = 'https://apistocktrading-production.up.railway.app/api/admin/trades/initiate';
        const response = await axios.post(url, orderData);
        return response.data;
    } catch (error) {
        console.error('Error placing trade order:', error);
        throw error;
    }
};

// Get positions
export const getPositions = async () => {
    try {
        const response = await axios.get('https://apistocktrading-production.up.railway.app/api/trading/positions');
        return response.data;
    } catch (error) {
        console.error('Error fetching positions:', error);
        return { success: false, data: [], error: error.message };
    }
};

// Get order history
export const getOrderHistory = async () => {
    try {
        const response = await axios.get('https://apistocktrading-production.up.railway.app/api/trading/order-history');
        return response.data;
    } catch (error) {
        console.error('Error fetching order history:', error);
        return { success: false, data: [], error: error.message };
    }
};

// Get LTP data
export const getLTPData = async (symbols) => {
    try {
        const response = await axios.post('https://apistocktrading-production.up.railway.app/api/market-data/ltp', { symbols });
        return response.data;
    } catch (error) {
        console.error('Error fetching LTP data:', error);
        return { success: false, data: {}, error: error.message };
    }
};
