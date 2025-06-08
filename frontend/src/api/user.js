// src/api/user.js
import api from './axios';

export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (profileData) => api.put('/user/profile', profileData);
export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/user/profile/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteProfileImage = () => api.delete('/user/profile/image/delete');