import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNav = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/sectors', label: 'Sectors', icon: '🎯' },
  { path: '/ai-advisor', label: 'AI Advisor', icon: '🤖' }, // NEW
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/goals', label: 'Goals', icon: '✓' },
  { path: '/badges', label: 'Badges', icon: '🏆' },
];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/dashboard')}
          >
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">HUMAN</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center gap-4">
            {/* Level & Points */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-center">
                <div className="text-xs text-white/50">Level</div>
                <div className="text-sm font-bold text-primary">{user?.human_level || 1}</div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-center">
                <div className="text-xs text-white/50">Points</div>
                <div className="text-sm font-bold text-primary">{user?.total_points || 0}</div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-center">
                <div className="text-xs text-white/50">Streak</div>
                <div className="text-sm font-bold text-primary">🔥 {user?.streak_days || 0}</div>
              </div>
            </div>

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform"
              >
                {user?.full_name?.charAt(0).toUpperCase()}
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-white/10 bg-white/5">
                      <div className="font-bold text-white">{user?.full_name}</div>
                      <div className="text-sm text-white/60">{user?.email}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-all"
                      >
                        ⚙️ Settings
                      </button>
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-all"
                      >
                        👤 Profile
                      </button>
                      <div className="h-px bg-white/10 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
