import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// before every request, check if we have a token and add it to the header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;