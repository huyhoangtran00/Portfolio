// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        {/* Left Section - Placeholder for image_f8ff55.jpg left panel */}
        <div className="hidden md:block w-1/2 p-8 bg-gradient-to-br from-indigo-700 to-purple-800 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Easy Portfolio for Developer</h2>
            <p className="text-lg">
              As a web developer, having a portfolio is essential for showcasing your technical skills and attracting potential clients. A portfolio is a museum of your work, with past tech stacks, case studies, and your work history.
            </p>
          </div>
          {/* Optional: Add a logo or decorative elements here */}
        </div>

        {/* Right Section - Authentication Forms */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet /> {/* Render the specific auth page here (Login, Signup, etc.) */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;