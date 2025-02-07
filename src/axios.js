import axios from "axios";

// Set the global Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/", // Change 8000 to your backend port
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("token") ? localStorage.getItem("token") : ""
  },
});

export default api;
