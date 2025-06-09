// src/api/project.js
import api from './axios';

export const createProject = (projectData) => api.post('/user/projects', projectData);
export const getProjectById = (projectId) => api.get(`/user/projects/${projectId}`); // If available/needed
export const updateProject = (projectId, projectData) => api.put(`/user/projects/${projectId}`, projectData);
export const deleteProject = (projectId) => api.delete(`/user/projects/${projectId}`);

// --- New API call ---
export const getAllUserProjects = () => api.get('/user/projects/me');
// --- End new API call ---