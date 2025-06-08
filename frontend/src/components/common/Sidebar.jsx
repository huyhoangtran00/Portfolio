// src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore'; // Import useUserStore

function Sidebar() {
  const userProfile = useUserStore((state) => state.userProfile);
  const userId = userProfile?.id; // Lấy ID người dùng từ profile

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/settings/profile"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md transition duration-200 ${
                  isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              Profile settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings/projects"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md transition duration-200 ${
                  isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H2zm0 2h16v10H2V6z"></path><path d="M7 8h6v2H7zM7 11h6v2H7zM7 14h6v2H7z"></path></svg>
              Projects settings
            </NavLink>
          </li>
          {/* Thêm link My Portfolio */}
          {/* Chỉ hiển thị link My Portfolio nếu userId đã có */}
          {userId && (
            <li>
              {/* Sử dụng biến userId đã lấy được từ hook */}
              <NavLink
                to={`/portfolio/${userId}`}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition duration-200 ${
                    isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 112 0 1 1 0 01-2 0zM13 10a1 1 0 112 0 1 1 0 01-2 0zM8 15a1 1 0 01-1 1h6a1 1 0 010-2H8a1 1 0 01-1-1z"></path></svg>
                My Portfolio
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;