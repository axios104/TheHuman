import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNav = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Main 4 navigation items
  const mainNavItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/sectors', icon: '📊', label: 'Sectors' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/ai-advisor', icon: '🤖', label: 'AI Advisor' },
  ];

  // Menu items (More options)
  const menuItems = [
    { path: '/news-feed', icon: '📰', label: 'News Feed' },
    { path: '/zone-out', icon: '✨', label: 'Zone Out' },
    { path: '/badges', icon: '🏆', label: 'Badges' },
    { path: '/profile', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-xl font-bold">
              H
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">HUMAN</span>
          </Link>

          {/* Main Navigation - 4 Items */}
          <div className="hidden md:flex items-center gap-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side - User Info + Menu Button */}
          <div className="flex items-center gap-3">
            {/* User Info */}
            {user && (
              <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user.full_name}</div>
                  <div className="text-xs text-white/50">Level {user.human_level} • {user.total_points} pts</div>
                </div>
                <div className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center text-sm font-bold text-white">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* More Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Bottom of nav */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-white/10">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'text-primary'
                  : 'text-white/70'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 right-4 w-64 rounded-xl border border-white/10 bg-background-dark/95 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              <div className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMenu(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/10 p-2">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default DashboardNav;
