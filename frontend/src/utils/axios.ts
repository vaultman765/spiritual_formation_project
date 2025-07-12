import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // your Django backend URL
  withCredentials: true,            // crucial for session auth
});

export default axiosInstance;