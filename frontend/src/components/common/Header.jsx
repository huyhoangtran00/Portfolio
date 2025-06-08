// src/components/common/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import useUserStore from '../../stores/userStore';

function Header() {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const clearUserState = useUserStore((state) => state.clearUserState);
  const userProfile = useUserStore((state) => state.userProfile); // Lấy profile để hiển thị ảnh/tên
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    clearTokens();
    clearUserState(); // Xóa trạng thái user khỏi store
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <Link to="/settings/profile" className="flex items-center text-gray-800 font-semibold text-lg">
        <img src="/blue.png" alt="DevPort Logo" className="h-7 mr-2" />
    BluePort
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userProfile?.profile_image_url ? (
              <img src={userProfile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.993a8.53 8.53 0 0 1 12-8.084 8.53 8.53 0 0 1 12 8.084zM12 12c3.313 0 6-2.687 6-6s-2.687-6-6-6-6 2.687-6 6 2.687 6 6 6z"></path></svg>
            )}
          </div>
          <span className="text-gray-800 hidden md:block">{userProfile?.name || userProfile?.email || 'User'}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="p-4 border-b border-gray-200">
              <p className="font-semibold text-gray-900">{userProfile?.name || 'User'}</p>
              <p className="text-sm text-gray-600">{userProfile?.email}</p>
            </div>
            <div className="py-1">
              <Link to="/settings/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                Profile settings
              </Link>
              <Link to="/settings/projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                Projects settings
              </Link>
              {userProfile?.id && (
                <Link to={`/portfolio/${userProfile.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                  My Portfolio
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;