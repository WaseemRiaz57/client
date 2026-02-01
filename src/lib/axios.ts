import axios from 'axios';

// 🔍 DEBUGGING: Check karein ke Env Var load hua ya nahi
const ENV_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("🔍 VERCEL ENV VAR:", ENV_URL); 

// ✅ SAFETY FIX: 
// 1. Agar Env Var undefined hai, to Localhost use karo.
// 2. Agar Env Var mein ghalti se '/api' laga hai, to usay hata do taake double na ho.
const RAW_URL = ENV_URL || 'http://https://luxewatch-backend.onrender.com';
const CLEAN_URL = RAW_URL.endsWith('/api') ? RAW_URL.slice(0, -4) : RAW_URL;

// Ab '/api' lagayen (Safe approach)
const BASE_URL = `${CLEAN_URL}/api`;

console.log("🚀 FINAL REQUEST URL:", BASE_URL); 

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Agar aap cookies use kar rahe hain to isay uncomment karein
});

// Request interceptor - Attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    // If token exists, attach it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`❌ API Error [${status}]:`, data?.message || error.message);

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            // Optional: redirect to login page
            // window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API Error:', data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;