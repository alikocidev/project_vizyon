import axios from "axios";

const baseURL = import.meta.env.VITE_APP_URL ? import.meta.env.VITE_APP_URL + "/api/" : "http://localhost:8000/api/";

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  timeout: 10000,
  withCredentials: false,
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }

    // 419 CSRF hatası için de logout yap
    if (error.response?.status === 419) {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      console.error("CSRF Token Mismatch");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
