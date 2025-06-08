// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import useAuthStore from '../../stores/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setTokens = useAuthStore((state) => state.setTokens);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      setTokens(response.data.access_token, response.data.refresh_token);
      navigate('/settings/profile'); // Redirect to profile settings after login
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <img src="/blue.png" alt="BluePort Logo" className="h-8 mb-6" /> 
      <h1 className="text-3xl font-bold mb-2">Login to account</h1>
      <p className="text-gray-600 mb-6 text-center">Enter your credentials to access your account</p>

      <button
        className="flex items-center justify-center w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 mb-4"
        disabled={loading}
      >
        <img src="/github.png" alt="GitHub" className="h-5 w-5 mr-2" /> 
        Sign in with Github
      </button>
      <div className="relative w-full text-center mb-4">
        <span className="inline-block bg-white px-2 text-gray-500">or</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 transform -translate-y-1/2 -z-10"></div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter a password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link to="/forgot-password" className="text-blue-600 text-sm mt-2 block text-right hover:underline">
            Forgot password
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Not a member?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;