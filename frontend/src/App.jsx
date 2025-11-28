import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/landing/auth/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import SectorsPage from './pages/SectorsPage';
import SectorChatPage from './pages/SectorChatPage';
import GoalsPage from './pages/GoalsPage';
import AIAdvisorPage from './pages/AIAdvisorPage';
import ProfilePage from './pages/ProfilePage';
import NewsFeedPage from './pages/NewsFeedPage';
import ZoneOutPage from './pages/ZoneOutPage';
import BadgesPage from './pages/BadgesPage';

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1c',
            color: '#fff',
            border: '1px solid rgba(13, 242, 242, 0.2)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#0df2f2',
              secondary: '#1a1a1c',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1a1c',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/sectors" element={
          <ProtectedRoute>
            <SectorsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/sector/:id" element={
          <ProtectedRoute>
            <SectorChatPage />
          </ProtectedRoute>
        } />
        
        <Route path="/goals" element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/ai-advisor" element={
          <ProtectedRoute>
            <AIAdvisorPage />
          </ProtectedRoute>
        } />
        
        <Route path="/news-feed" element={
          <ProtectedRoute>
            <NewsFeedPage />
          </ProtectedRoute>
        } />
        
        <Route path="/zone-out" element={
          <ProtectedRoute>
            <ZoneOutPage />
          </ProtectedRoute>
        } />
        
        <Route path="/badges" element={
          <ProtectedRoute>
            <BadgesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
