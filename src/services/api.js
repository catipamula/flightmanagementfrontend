import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("accessToken");
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Test API function
export const testAPI = () => api.get("auth/test/");

export const registerUser = (data) => api.post("auth/register/", data);
export const loginUser = (data) => api.post("auth/login/", data);
export const fetchFlights = () => api.get("auth/flights/");
export const fetchFlightDetail = (id) => api.get(`auth/flights/${id}/`);
export const createBooking = (data) => api.post("bookings/", data);
export const fetchMyTrips = () => api.get("bookings/");
export const fetchPendingUsers = () => api.get("auth/admin/users/pending/");
export const approveUser = (id, action) =>
  api.post(`auth/admin/users/${id}/approve/`, { action });

// Payment API functions
export const createPaymentIntent = (data) => api.post("auth/payment/create-intent/", data);
export const confirmPayment = (data) => api.post("auth/payment/confirm/", data);
export const getPaymentConfig = () => api.get("auth/payment/config/");

export default api;
