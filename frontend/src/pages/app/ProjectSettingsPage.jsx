// src/pages/app/ProjectSettingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import useUserStore from '../../stores/userStore';
import { createProject, updateProject, deleteProject, getAllUserProjects } from '../../api/project';

// Define the hardcoded image URL
const HARDCODED_IMAGE_URL = "/blue.png"; // **IMPORTANT: Update this path to where your image is served**

function ProjectSettingsPage() {
  const { userProfile, fetchUserProfile, projects, setProjects, addOrUpdateProjectState, deleteProjectState, isLoading, error } = useUserStore();
  const [editingProject, setEditingProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [description, setDescription] = useState('');
  // Removed tempProjectImageUrl state as it's no longer needed for uploads
  const [localLoading, setLocalLoading] = useState(false);
  // Removed uploadingImage, uploadError states as they are no longer needed
  const [formError, setFormError] = useState('');

  // Function to fetch all projects for the current user
  const fetchAllProjects = useCallback(async () => {
    if (!userProfile) return;
    setLocalLoading(true);
    try {
      const response = await getAllUserProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch user projects:', err);
      // Optionally set an error state for project list fetching
    } finally {
      setLocalLoading(false);
    }
  }, [userProfile, setProjects]);

  useEffect(() => {
    // Initial fetch of user profile (which might contain projects)
    if (!userProfile && !isLoading && !error) {
      fetchUserProfile();
    }
  }, [userProfile, isLoading, error, fetchUserProfile]);

  useEffect(() => {
    // Fetch all projects when userProfile is loaded or when component mounts if userProfile exists
    if (userProfile) {
      fetchAllProjects();
    }
  }, [userProfile, fetchAllProjects]);

  useEffect(() => {
    // When a project is selected for editing, populate the form
    if (editingProject) {
      setProjectName(editingProject.name || '');
      setDemoUrl(editingProject.demo_url || '');
      setRepositoryUrl(editingProject.repository_url || '');
      setDescription(editingProject.description || '');
      // No need to set image URL from editingProject if it's hardcoded
    } else {
      // Reset form when creating a new project
      setProjectName('');
      setDemoUrl('');
      setRepositoryUrl('');
      setDescription('');
      // No need to clear image URL if it's hardcoded
      setFormError('');
    }
  }, [editingProject]);

  const handleAddProjectClick = () => {
    setEditingProject(null); // Clear editing state for a new project
  };

  const handleEditProjectClick = (project) => {
    setEditingProject(project);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLocalLoading(true);

    const projectData = {
      name: projectName,
      demo_url: demoUrl || null,
      repository_url: repositoryUrl || null,
      description: description || null,
      // Hardcode the image_url for both create and update
      image_url: HARDCODED_IMAGE_URL,
    };

    try {
      let response;
      if (editingProject) {
        response = await updateProject(editingProject.id, projectData);
        alert('Project updated successfully!');
      } else {
        response = await createProject(projectData);
        alert('Project created successfully!');
      }
      addOrUpdateProjectState(response.data); // Update local state
      setEditingProject(null); // Clear form or editing state
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to save project.');
      console.error('Project save error:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    setLocalLoading(true);
    try {
      await deleteProject(projectId);
      deleteProjectState(projectId); // Update local state
      alert('Project deleted successfully!');
      if (editingProject && editingProject.id === projectId) {
        setEditingProject(null); // If the deleted project was being edited, clear the form
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Removed handleProjectImageUpload and handleProjectImageDelete functions

  if (isLoading || localLoading) return <p>Loading projects...</p>;
  if (error && !userProfile) return <p className="text-red-500">Error: {error}</p>;
  if (!userProfile) return <p>No user profile data available. Please log in.</p>;

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Project settings</h1>

      <button
        onClick={handleAddProjectClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 mb-6 flex items-center"
      >
        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 9H13V11H11V13H9V11H7V9H9V7H11V9Z" /><path d="M10 2C5.589 2 2 5.589 2 10C2 14.411 5.589 18 10 18C14.411 18 18 14.411 18 10C18 5.589 14.411 2 10 2ZM10 16C6.686 16 4 13.314 4 10C4 6.686 6.686 4 10 4C13.314 4 16 6.686 16 10C16 13.314 13.314 16 10 16Z" /></svg>
        Add project
      </button>

      {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border border-gray-200 rounded-md">
        <h2 className="text-xl font-medium mb-4">{editingProject ? 'Edit Project' : 'New Project'}</h2>

        <div className="mb-4 flex flex-col items-center">
          <div className="relative w-40 h-40 border-2 border-gray-300 flex items-center justify-center bg-gray-200 text-gray-500 overflow-hidden">
            {/* Always display the hardcoded image */}
            <img src={HARDCODED_IMAGE_URL} alt="Project Preview" className="w-full h-full object-cover" />
          </div>
          {/* Removed image upload/delete buttons and error display */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="projectName" className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
            <input
              type="text"
              id="projectName"
              placeholder="Enter your project name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="demoUrl" className="block text-gray-700 text-sm font-bold mb-2">Demo URL</label>
            <input
              type="url"
              id="demoUrl"
              placeholder="Enter the demo URL"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="repositoryUrl" className="block text-gray-700 text-sm font-bold mb-2">Repository URL</label>
          <input
            type="url"
            id="repositoryUrl"
            placeholder="Enter the repository URL"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            id="description"
            placeholder="Enter a short description.."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          {editingProject && (
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300 font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
            disabled={localLoading}
          >
            {localLoading ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')}
          </button>
        </div>
      </form>

      {/* List of existing projects */}
      <h2 className="text-xl font-semibold mb-4 mt-8">Your Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-600">No projects added yet. Click "Add project" to create your first one!</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-md p-4 flex items-start space-x-4">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                {/* Always display the hardcoded image */}
                <img src={HARDCODED_IMAGE_URL} alt={project.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
                <div className="mt-2 flex space-x-2 text-sm">
                  {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Demo URL</a>}
                  {project.repository_url && <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Repository URL</a>}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditProjectClick(project)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectSettingsPage;