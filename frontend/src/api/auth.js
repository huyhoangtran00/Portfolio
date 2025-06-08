// src/api/auth.js
import api from './axios';

export const login = (email, password) => api.post('/user/login',  {  email, password });
export const signup = (email, password, name) => api.post('/user/signup', { email, password, name });
export const forgotPassword = (email) => api.post('/user/forgot-password', { email });
export const resetPassword = (token, new_password) => api.post('/user/reset-password', { token, new_password });
// export const refreshToken = (refreshToken) => api.post('/user/refresh-token', { refresh_token: refreshToken });