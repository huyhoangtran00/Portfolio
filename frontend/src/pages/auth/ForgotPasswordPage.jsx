// src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <img src="/blue.png" alt="BluePort" className="h-8 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Forgot your password?</h1>
      <p className="text-gray-600 mb-6 text-center">Enter your email and we'll send you a reset link.</p>

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
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
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Remember your password?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default ForgotPasswordPage;