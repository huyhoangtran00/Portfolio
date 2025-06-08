// src/stores/authStore.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'), // Kiểm tra ban đầu
  user: null, // Thông tin user nếu muốn lưu sau khi login

  setTokens: (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null });
  },
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;