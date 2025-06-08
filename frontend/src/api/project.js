// src/api/project.js
import api from './axios';

export const createProject = (projectData) => api.post('/user/projects', projectData);
export const getProjectById = (projectId) => api.get(`/user/projects/${projectId}`); // Nếu có
export const updateProject = (projectId, projectData) => api.put(`/user/projects/${projectId}`, projectData);
export const deleteProject = (projectId) => api.delete(`/user/projects/${projectId}`);
export const uploadProjectImage = (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/user/projects/${projectId}/image/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const deleteProjectImage = (projectId) => api.delete(`/user/projects/${projectId}/image/delete`);