import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PhilosophyPage from './pages/PhilosophyPage';
import StoriesPage from './pages/StoriesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import SectorDetailPage from './pages/SectorDetailPage';
import ProfilePage from './pages/ProfilePage';
import SectorsPage from './pages/SectorsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import GoalsPage from './pages/GoalsPage';
import BadgesPage from './pages/BadgesPage';
import ProtectedRoute from './components/landing/auth/ProtectedRoute';
import AIAdvisorPage from './pages/AIAdvisorPage';

function App() {
  return (
    <div className="App bg-background-dark min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sectors"
          element={
            <ProtectedRoute>
              <SectorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sector/:sectorId"
          element={
            <ProtectedRoute>
              <SectorDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedRoute>
              <BadgesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-advisor"
          element={
            <ProtectedRoute>
              <AIAdvisorPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
