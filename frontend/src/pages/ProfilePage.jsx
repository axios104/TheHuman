import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Settings states
  const [settings, setSettings] = useState({
    emailNotifications: true,
    aiSuggestions: true,
    dailyReminders: false,
  });

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

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

  const handleUpdateProfile = async () => {
    // TODO: Implement profile update API
    console.log('Updating profile:', formData);
    setEditMode(false);
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    // TODO: Save to backend
    console.log('Settings updated:', { ...settings, [setting]: !settings[setting] });
  };

  const handleExportData = () => {
    // Create dummy data export
    const exportData = {
      user: user,
      exportDate: new Date().toISOString(),
      sectors: [],
      goals: [],
      messages: []
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `human-data-export-${Date.now()}.json`;
    link.click();
    
    setShowExportModal(false);
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
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="size-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-4 border-primary/50 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-2xl font-bold"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-bold text-white mb-2">{user.full_name}</h1>
                    <p className="text-white/60 mb-4">{user.email}</p>
                  </>
                )}
                
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
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button 
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
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
                <button 
                  onClick={() => toggleSetting('emailNotifications')}
                  className={`w-14 h-7 rounded-full relative transition-all ${
                    settings.emailNotifications ? 'bg-primary' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 size-5 rounded-full bg-white shadow-lg transition-all ${
                    settings.emailNotifications ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>

              {/* AI Suggestions */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">AI Suggestions</p>
                  <p className="text-sm text-white/60">Get proactive insights and recommendations</p>
                </div>
                <button 
                  onClick={() => toggleSetting('aiSuggestions')}
                  className={`w-14 h-7 rounded-full relative transition-all ${
                    settings.aiSuggestions ? 'bg-primary' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 size-5 rounded-full bg-white shadow-lg transition-all ${
                    settings.aiSuggestions ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>

              {/* Daily Reminders */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">Daily Reminders</p>
                  <p className="text-sm text-white/60">Get reminded to check in daily</p>
                </div>
                <button 
                  onClick={() => toggleSetting('dailyReminders')}
                  className={`w-14 h-7 rounded-full relative transition-all ${
                    settings.dailyReminders ? 'bg-primary' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 size-5 rounded-full bg-white shadow-lg transition-all ${
                    settings.dailyReminders ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>

              {/* Data Export */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-white font-medium mb-1">Data Export</p>
                  <p className="text-sm text-white/60">Download all your data anytime</p>
                </div>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
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
                <button 
                  onClick={() => setShow2FAModal(true)}
                  className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
                >
                  Enable
                </button>
              </div>

              {/* Change Password */}
              <div className="flex items-center justify-between py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-medium mb-1">Change Password</p>
                  <p className="text-sm text-white/60">Update your password regularly</p>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                >
                  Change
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-white font-medium mb-1">Delete Account</p>
                  <p className="text-sm text-white/60">Permanently remove your account and data</p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>

          {/* Logout Button */}
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

      {/* MODALS */}
      
      {/* Change Password Modal */}
      <PasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Export Data Modal */}
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExportData}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleLogout}
      />

      {/* 2FA Modal */}
      <TwoFactorModal 
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
      />
    </div>
  );
};

// Password Change Modal Component
const PasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    // TODO: Implement password change API
    console.log('Changing password...');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h3 className="text-xl font-bold text-white">Change Password</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
                  required
                />
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Export Data Modal Component
const ExportModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-5xl mb-4 text-center">📦</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">Export Your Data</h3>
                <p className="text-white/60 text-center mb-6">
                  Download a JSON file containing all your sectors, goals, messages, and statistics.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                  >
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Delete Account Modal Component
const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-red-500/30 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-5xl mb-4 text-center">⚠️</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2 text-center">Delete Account</h3>
                <p className="text-white/60 text-center mb-6">
                  This action cannot be undone. All your data will be permanently deleted.
                  Type <span className="text-white font-bold">DELETE</span> to confirm.
                </p>
                <input
                  type="text"
                  placeholder="Type DELETE"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-red-500 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmText === 'DELETE' ? onConfirm : null}
                    disabled={confirmText !== 'DELETE'}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-500 text-white font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// 2FA Modal Component
const TwoFactorModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-5xl mb-4 text-center">🔐</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">Two-Factor Authentication</h3>
                <p className="text-white/60 text-center mb-6">
                  This feature is coming soon! You'll be able to add an extra layer of security to your account.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfilePage;
