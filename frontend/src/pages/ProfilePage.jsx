import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setFormData({
        full_name: response.data.full_name,
        email: response.data.email
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />

      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Profile Header */}
          <motion.div
            className="mb-12 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="size-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary/50 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{user.full_name}</h1>
                <p className="text-white/60 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-white/50">Level</span>
                    <div className="text-lg font-bold text-primary">{user.human_level}</div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-white/50">Total Points</span>
                    <div className="text-lg font-bold text-primary">{user.total_points}</div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-white/50">Streak</span>
                    <div className="text-lg font-bold text-primary">🔥 {user.streak_days}</div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-xs text-white/50">Member Since</span>
                    <div className="text-sm font-medium text-white">{memberSince}</div>
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              <button 
                onClick={() => setEditMode(!editMode)}
                className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-all"
              >
                {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            className="mb-6 p-6 rounded-xl border border-white/10 bg-black/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>⚙️</span>
              <span>Account Settings</span>
            </h3>
            
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">Email Notifications</p>
                  <p className="text-sm text-white/60">Receive updates about your progress</p>
                </div>
                <button className="w-14 h-7 rounded-full bg-primary relative transition-all">
                  <div className="absolute right-1 top-1 size-5 rounded-full bg-white shadow-lg"></div>
                </button>
              </div>

              {/* AI Suggestions */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">AI Suggestions</p>
                  <p className="text-sm text-white/60">Get proactive insights and recommendations</p>
                </div>
                <button className="w-14 h-7 rounded-full bg-primary relative transition-all">
                  <div className="absolute right-1 top-1 size-5 rounded-full bg-white shadow-lg"></div>
                </button>
              </div>

              {/* Daily Reminders */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">Daily Reminders</p>
                  <p className="text-sm text-white/60">Get reminded to check in daily</p>
                </div>
                <button className="w-14 h-7 rounded-full bg-white/10 relative transition-all">
                  <div className="absolute left-1 top-1 size-5 rounded-full bg-white/60 shadow-lg"></div>
                </button>
              </div>

              {/* Data Export */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-white font-medium mb-1">Data Export</p>
                  <p className="text-sm text-white/60">Download all your data anytime</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                  Export Data
                </button>
              </div>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            className="mb-6 p-6 rounded-xl border border-white/10 bg-black/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🔒</span>
              <span>Privacy & Security</span>
            </h3>
            
            <div className="space-y-4">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">Two-Factor Authentication</p>
                  <p className="text-sm text-white/60">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all">
                  Enable
                </button>
              </div>

              {/* Change Password */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">Change Password</p>
                  <p className="text-sm text-white/60">Update your password regularly</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                  Change
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-white font-medium mb-1">Delete Account</p>
                  <p className="text-sm text-white/60">Permanently remove your account and data</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
                  Delete
                </button>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
