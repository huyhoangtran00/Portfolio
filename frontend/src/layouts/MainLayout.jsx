// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header'; // Bạn sẽ tạo Header này
import Sidebar from '../components/common/Sidebar'; // Bạn sẽ tạo Sidebar này

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet /> {/* Render the specific app page here (ProfileSettings, ProjectSettings) */}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;