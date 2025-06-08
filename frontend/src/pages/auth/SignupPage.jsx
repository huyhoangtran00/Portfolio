// src/pages/auth/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import PasswordInput from '../../components/auth/PasswordInput'; // Sẽ tạo component này

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name);
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <img src="/blue.png" alt="BluePort Logo" className="h-8 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Create your account</h1>
      <p className="text-gray-600 mb-6 text-center">Enter the fields below to get started</p>

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
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        {/* Sử dụng PasswordInput component để hiển thị yêu cầu mật khẩu */}
        <PasswordInput password={password} setPassword={setPassword} />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default SignupPage;