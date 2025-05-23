import axios from 'axios';

// Đọc baseURL từ biến môi trường
const API_BASE_URL = process.env.REACT_APP_API_URL //|| 'http://localhost:8080/identify';

// Tạo instance Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Cho phép gửi cookie nếu cần
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


// Interceptor xử lý token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;