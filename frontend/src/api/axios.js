// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm Access Token vào mọi request (trừ login/signup)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi response, ví dụ: refresh token khi access token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi là 401 Unauthorized và không phải là request refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử lại 1 lần
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Nếu không có refresh token, redirect về login
          window.location.href = '/login'; // Điều hướng về trang login
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/refresh-token`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = res.data;

        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', newRefreshToken); // Cập nhật refresh token nếu có

        // Cập nhật token cho request gốc và thử lại
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại hoặc hết hạn, redirect về login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;