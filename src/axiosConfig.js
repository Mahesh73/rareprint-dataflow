import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000', 
  // baseURL: 'http://localhost:5000', 
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers like auth tokens here
    // 'Authorization': 'Bearer your_token',
  },
});

// Add a request interceptor (optional, for auth or other logic)
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify config before the request is sent, e.g., attach a token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional, for error handling)
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle the response data
    return response;
  },
  (error) => {
    // Handle errors (e.g., unauthorized access, 404 errors)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - redirecting to login');
      // You can redirect to the login page or logout the user
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
