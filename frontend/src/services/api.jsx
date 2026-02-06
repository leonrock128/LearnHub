import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Course APIs
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
};

// Subscription APIs
export const subscriptionAPI = {
  subscribe: (data) => api.post('/subscribe', data),
  getMyCourses: () => api.get('/my-courses'),
};

export default api;