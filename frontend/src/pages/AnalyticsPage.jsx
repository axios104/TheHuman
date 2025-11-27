import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, sectorAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchUserData();
    fetchSectors();
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

  const fetchSectors = async () => {
    try {
      const response = await sectorAPI.getAll();
      setSectors(response.data);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
              <p className="text-white/60">Track your progress and insights</p>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
              {['week', 'month', 'year', 'all'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeframe === tf
                      ? 'bg-primary text-background-dark'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Activities', value: '0', icon: '📊', trend: '+0%' },
              { label: 'Goals Completed', value: '0', icon: '✓', trend: '+0%' },
              { label: 'Current Streak', value: user.streak_days.toString(), icon: '🔥', trend: '+0%' },
              { label: 'Total Points', value: user.total_points.toString(), icon: '⭐', trend: '+0%' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl border border-white/10 bg-black/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{stat.icon}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                    {stat.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Chart Placeholder */}
          <motion.div
            className="mb-12 p-8 rounded-xl border border-white/10 bg-black/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Activity Over Time</h3>
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
              <div className="text-center">
                <div className="text-5xl mb-3">📈</div>
                <p className="text-white/60">Activity chart coming soon</p>
                <p className="text-sm text-white/40">Start tracking to see your progress</p>
              </div>
            </div>
          </motion.div>

          {/* Sector Breakdown */}
          <motion.div
            className="p-8 rounded-xl border border-white/10 bg-black/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Sector Breakdown</h3>
            
            {sectors.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-white/60 mb-4">No sectors yet</p>
                <button
                  onClick={() => navigate('/sectors')}
                  className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                >
                  Create Your First Sector
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sectors.map((sector, idx) => (
                  <div
                    key={sector.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate(`/sector/${sector.id}`)}
                  >
                    <div className="text-3xl">{sector.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white mb-1">{sector.name}</div>
                      <div className="text-sm text-white/60">{sector.sector_type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: sector.color }}>0</div>
                      <div className="text-xs text-white/60">activities</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
