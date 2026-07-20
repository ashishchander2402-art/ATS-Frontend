import axios from "axios";

const api = axios.create({
  baseURL:  "http://localhost:5000/api/", // React + Vite
  // baseURL: process.env.REACT_APP_API_BASE_URL, // CRA

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;