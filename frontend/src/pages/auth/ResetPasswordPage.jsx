// src/pages/auth/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import PasswordInput from '../../components/auth/PasswordInput';
function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('No reset token found in URL.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== reEnterPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login'); // Redirect to login after successful reset
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <img src="/blue.png" alt="BluePort Logo" className="h-8 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Choose new password</h1>
      <p className="text-gray-600 mb-6 text-center">Enter your new password and you're all set.</p>

      {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Sử dụng PasswordInput component cho mật khẩu mới */}
        <PasswordInput password={newPassword} setPassword={setNewPassword} />
        <div>
          <input
            type="password"
            placeholder="Re-enter a password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
          disabled={loading}
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>

      {message && (
        <p className="mt-6 text-sm text-gray-600">
          You will be redirected to the login page shortly. <Link to="/login" className="text-blue-600 hover:underline">Log in now</Link>.
        </p>
      )}
    </div>
  );
}

export default ResetPasswordPage;