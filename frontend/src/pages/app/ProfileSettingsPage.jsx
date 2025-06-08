// src/pages/app/ProfileSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import useUserStore from '../../stores/userStore';
import { updateUserProfile, uploadProfileImage, deleteProfileImage } from '../../api/user';

function ProfileSettingsPage() {
  const { userProfile, fetchUserProfile, updateUserProfileState, isLoading, error } = useUserStore();
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [tempProfileImageUrl, setTempProfileImageUrl] = useState(''); // Để hiển thị ảnh trước khi upload
  const [localLoading, setLocalLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!userProfile && !isLoading && !error) {
      fetchUserProfile();
    }
    if (userProfile) {
      setName(userProfile.name || '');
      setJobTitle(userProfile.job_title || '');
      setBio(userProfile.bio || '');
      setTempProfileImageUrl(userProfile.profile_image_url || '');
    }
  }, [userProfile, isLoading, error, fetchUserProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      const updatedData = { name, job_title: jobTitle, bio };
      const response = await updateUserProfile(updatedData);
      updateUserProfileState(response.data); // Cập nhật state cục bộ
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError('');
    try {
      const response = await uploadProfileImage(file);
      const newImageUrl = response.data.image_url;
      updateUserProfileState({ profile_image_url: newImageUrl }); // Cập nhật state cục bộ
      setTempProfileImageUrl(newImageUrl);
      alert('Profile image uploaded successfully!');
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Failed to upload image.');
      console.error('Image upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("Are you sure you want to delete your profile image?")) {
        return;
    }
    setUploadingImage(true); // Dùng lại trạng thái loading
    setUploadError('');
    try {
        await deleteProfileImage();
        updateUserProfileState({ profile_image_url: null }); // Cập nhật state cục bộ
        setTempProfileImageUrl('');
        alert('Profile image deleted successfully!');
    } catch (err) {
        setUploadError(err.response?.data?.detail || 'Failed to delete image.');
        console.error('Delete image error:', err);
    } finally {
        setUploadingImage(false);
    }
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error && !userProfile) return <p className="text-red-500">Error: {error}</p>;
  if (!userProfile) return <p>No profile data available.</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Profile settings</h1>

      <div className="mb-6 flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-200 text-gray-500">
          {tempProfileImageUrl ? (
            <img src={tempProfileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.993a8.53 8.53 0 0 1 12-8.084 8.53 8.53 0 0 1 12 8.084zM12 12c3.313 0 6-2.687 6-6s-2.687-6-6-6-6 2.687-6 6 2.687 6 6 6z"></path>
            </svg>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-2">Image must be 256x256px - max 2MB</p>
        <div className="mt-4 flex space-x-2">
          <label htmlFor="image-upload" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition duration-300 text-sm">
            {uploadingImage ? 'Uploading...' : 'Upload Profile Image'}
            <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
          </label>
          {tempProfileImageUrl && (
            <button
              onClick={handleDeleteImage}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 text-sm"
              disabled={uploadingImage}
            >
              Delete Image
            </button>
          )}
        </div>
        {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              value={userProfile.email}
              disabled
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">Job title</label>
            <input
              type="text"
              id="jobTitle"
              placeholder="Enter your job title"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
          <textarea
            id="bio"
            placeholder="Enter a short introduction.."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
            disabled={localLoading}
          >
            {localLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileSettingsPage;