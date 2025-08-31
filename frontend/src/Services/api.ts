import axios from "axios";

// Axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    } else if (error.response?.status === 419) {
      // 419 CSRF hatası için de logout yap
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      console.error("CSRF Token Mismatch");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
