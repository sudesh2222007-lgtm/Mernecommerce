import axios from "axios";

// In development, Vite proxies "/api" to http://localhost:5000 (see vite.config.js).
// In production (e.g. deployed on Vercel), set VITE_API_URL to your hosted
// backend's URL, e.g. https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

// Attach token automatically if user is logged in
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
