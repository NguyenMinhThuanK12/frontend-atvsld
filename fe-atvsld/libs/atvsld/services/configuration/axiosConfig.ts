import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

console.log("Axios Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

api.interceptors.request.use((config) => {
  const token = Cookies.get("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;