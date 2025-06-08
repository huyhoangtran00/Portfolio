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

  // Phương thức để cập nhật profile cục bộ sau khi chỉnh sửa
  updateUserProfileState: (updatedProfile) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...updatedProfile },
    }));
  },

  // Phương thức để thêm/cập nhật project cục bộ
  addOrUpdateProjectState: (newProject) => {
    set((state) => {
      const existingProjectIndex = state.projects.findIndex(p => p.id === newProject.id);
      if (existingProjectIndex > -1) {
        // Cập nhật project hiện có
        const updatedProjects = [...state.projects];
        updatedProjects[existingProjectIndex] = newProject;
        return { projects: updatedProjects };
      } else {
        // Thêm project mới
        return { projects: [...state.projects, newProject] };
      }
    });
  },

  // Phương thức để xóa project cục bộ
  deleteProjectState: (projectId) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== projectId),
    }));
  },

  // Clear state khi logout
  clearUserState: () => set({ userProfile: null, projects: [], isLoading: false, error: null }),
}));

export default useUserStore;