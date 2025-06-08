// src/pages/app/PublicPortfolioPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Sử dụng axios thông thường vì không cần token
import { format } from 'date-fns';

function PublicPortfolioPage() {
  const { userId } = useParams(); // Lấy userId từ URL
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Sửa lỗi ở đây: Sử dụng cú pháp template literal đúng
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/portfolio/${userId}`);
        setPortfolio(response.data);
    
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load portfolio.');
        console.error('Portfolio fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPortfolio();
    } else {
      setError('User ID not provided.');
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <div className="text-center p-8">Loading portfolio...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!portfolio) return <div className="text-center p-8">Portfolio not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header / Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {portfolio.profile_image_url ? (
              <img
                src={portfolio.profile_image_url}
                alt={portfolio.name || 'Profile'}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-6xl font-bold">
                {portfolio.name ? portfolio.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">{portfolio.name || 'DevPort User'}</h1>
            <p className="text-xl text-indigo-600 mb-2">{portfolio.job_title || 'Developer'}</p>
            <p className="text-gray-700 text-base mb-4">{portfolio.bio || 'A passionate developer showcasing their work.'}</p>
            <a href={`mailto:${portfolio.email}`} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
              Contact
            </a>
          </div>
        </div>

        {/* Projects Section */}
        <hr className="my-8 border-gray-300" />
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Projects</h2>
        {portfolio.projects && portfolio.projects.length > 0 ? (
          <div className="space-y-8">
            {portfolio.projects.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row bg-gray-50 p-6 rounded-lg shadow-sm items-center">
                <div className="flex-shrink-0 w-48 h-32 md:w-64 md:h-40  rounded-md overflow-hidden mr-0 md:mr-6 mb-4 md:mb-0 flex items-center justify-center">
                  {project.image_url ? (
                    <img src="/blue.png" alt="blue.png" className="w-full h-full object-cover" />
                  ) : (
                   <img src="/blue.png" alt={project.name} />    
                  )}
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h3>
                  <p className="text-gray-700 text-base mb-3">{project.description}</p>
                  <div className="flex justify-center md:justify-start space-x-4">
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm">
                        Demo URL
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    )}
                    {project.repository_url && (
                      <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-300 text-sm">
                        Repository URL
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No projects to display yet.</p>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by <span className="font-semibold text-indigo-600">BluePort</span></p>
        </div>
      </div>
    </div>
  );
}

export default PublicPortfolioPage;