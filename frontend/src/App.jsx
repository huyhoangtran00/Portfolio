// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfileSettingsPage from './pages/app/ProfileSettingsPage';
import ProjectSettingsPage from './pages/app/ProjectSettingsPage';
import PublicPortfolioPage from './pages/app/PublicPortfolioPage';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import useAuthStore from './stores/authStore';

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} /> {/* Redirect root to login */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        {/* Nếu có xác thực email: <Route path="verify-email" element={<VerifyEmailPage />} /> */}
      </Route>

      {/* Authenticated Routes */}
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="settings/profile" element={<ProfileSettingsPage />} />
        <Route path="settings/projects" element={<ProjectSettingsPage />} />
        {/* Có thể thêm các trang khác yêu cầu đăng nhập */}
      </Route>

      {/* Public Portfolio Page (không cần đăng nhập) */}
      <Route path="/portfolio/:userId" element={<PublicPortfolioPage />} />
      {/* Nếu bạn muốn portfolio của người dùng hiện tại: <Route path="/my-portfolio" element={<PrivateRoute><PublicPortfolioPage current_user={true} /></PrivateRoute>} /> */}

      {/* Catch-all for 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;