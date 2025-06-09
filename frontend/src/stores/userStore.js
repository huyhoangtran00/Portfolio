// src/stores/userStore.js
import { create } from 'zustand';
import { getUserProfile } from '../api/user'; // Giả sử bạn có API này

const useUserStore = create((set) => ({
  userProfile: null,
  projects: [],
  isLoading: false,
  error: null,

  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getUserProfile();
      set({ userProfile: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Failed to fetch user profile:", error);
    }
  },

  updateUserProfileState: (updatedProfile) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...updatedProfile },
    }));
  },

  // Add this new method to set the entire projects array
  setProjects: (newProjects) => {
    set({ projects: newProjects });
  },

  addOrUpdateProjectState: (newProject) => {
    set((state) => {
      const existingProjectIndex = state.projects.findIndex(p => p.id === newProject.id);
      if (existingProjectIndex > -1) {
        const updatedProjects = [...state.projects];
        updatedProjects[existingProjectIndex] = newProject;
        return { projects: updatedProjects };
      } else {
        return { projects: [...state.projects, newProject] };
      }
    });
  },

  deleteProjectState: (projectId) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== projectId),
    }));
  },

  clearUserState: () => set({ userProfile: null, projects: [], isLoading: false, error: null }),
}));

export default useUserStore;