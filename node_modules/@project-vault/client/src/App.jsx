import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';

import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { HomeShowcase } from './pages/HomeShowcase';

import { ExploreProjects } from './pages/ExploreProjects';
import { Leaderboard } from './pages/Leaderboard';
import { Analytics } from './pages/Analytics';
import { FacultyReviews } from './pages/FacultyReviews';
import { AboutUs } from './pages/AboutUs';
import { ContactSupport } from './pages/ContactSupport';
import { NotFound } from './pages/NotFound';

/** Wrapper so page components that expect onNavigate/onAuthSuccess get the RR navigate fn */
function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  return (
    <SignIn
      onNavigate={(path) => navigate(path)}
      onAuthSuccess={(userData, authToken) => {
        login(userData, authToken);
        navigate('/dashboard');
      }}
    />
  );
}

function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  return (
    <SignUp
      onNavigate={(path) => navigate(path)}
      onAuthSuccess={(userData, authToken) => {
        login(userData, authToken);
        navigate('/dashboard');
      }}
    />
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  return <ForgotPassword onNavigate={(path) => navigate(path)} />;
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  return <ResetPassword onNavigate={(path) => navigate(path)} />;
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();

  if (!token) return <Navigate to="/signin" replace />;

  return (
    <Dashboard
      user={user}
      token={token}
      onNavigate={(path) => navigate(path)}
      onLogout={() => {
        logout();
        navigate('/');
      }}
      updateUser={updateUser}
    />
  );
}

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <HomeShowcase onNavigate={(path) => navigate(path)} user={user} />;
}

function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <ExploreProjects onNavigate={(path) => navigate(path)} user={user} />;
}

function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <Leaderboard onNavigate={(path) => navigate(path)} user={user} />;
}

function AnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <Analytics onNavigate={(path) => navigate(path)} user={user} />;
}

function FacultyReviewsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <FacultyReviews onNavigate={(path) => navigate(path)} user={user} />;
}

function AboutUsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <AboutUs onNavigate={(path) => navigate(path)} user={user} />;
}

function ContactSupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <ContactSupport onNavigate={(path) => navigate(path)} user={user} />;
}

function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return <NotFound onNavigate={(path) => navigate(path)} user={user} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Standalone Pages */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/faculty-reviews" element={<FacultyReviewsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactSupportPage />} />

          {/* Global 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      {/* Global React Toast Notification Container */}
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} />
    </AuthProvider>
  );
}
