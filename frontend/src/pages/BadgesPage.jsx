import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';

const BadgesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const allBadges = [
    { name: 'First Step', icon: '👣', description: 'Create your first sector', locked: false },
    { name: 'Consistent', icon: '🔥', description: '7 day streak', locked: true },
    { name: 'Dedicated', icon: '💪', description: '30 day streak', locked: true },
    { name: 'Goal Setter', icon: '🎯', description: 'Set 5 goals', locked: true },
    { name: 'Achiever', icon: '✓', description: 'Complete 10 goals', locked: true },
    { name: 'Level 5', icon: '⭐', description: 'Reach level 5', locked: true },
  ];

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Badges & Achievements</h1>
            <p className="text-white/60">Unlock badges as you progress on your journey</p>
          </div>

          {/* Progress */}
          <motion.div
            className="mb-12 p-6 rounded-xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Your Progress</h3>
              <span className="text-primary font-bold">0 / {allBadges.length}</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '0%' }}></div>
            </div>
          </motion.div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-xl border text-center transition-all ${
                  badge.locked
                    ? 'border-white/10 bg-black/20 opacity-50'
                    : 'border-primary/30 bg-gradient-to-br from-primary/10 to-transparent hover:scale-105'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: badge.locked ? 0.5 : 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={!badge.locked ? { scale: 1.05 } : {}}
              >
                <div className={`text-6xl mb-4 ${badge.locked ? 'grayscale' : ''}`}>
                  {badge.locked ? '🔒' : badge.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{badge.name}</h4>
                <p className="text-sm text-white/60">{badge.description}</p>
                {!badge.locked && (
                  <div className="mt-4 text-xs text-primary font-medium">UNLOCKED ✓</div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BadgesPage;
