import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, sectorAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';
import CreateSectorModal from '../components/dashboard/CreateSectorModal';
import SectorDetailModal from '../components/dashboard/SectorDetailModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleSectorClick = (sectorId) => {
    setSelectedSectorId(sectorId);
    setShowDetailModal(true);
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

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />
      
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user.full_name.split(' ')[0]} 👋
            </h2>
            <p className="text-lg text-white/60">Continue your evolution journey</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Active Sectors', value: sectors.length.toString(), icon: '📊', color: 'from-blue-500/20 to-blue-500/5' },
              { label: 'Total Points', value: user.total_points.toString(), icon: '⭐', color: 'from-yellow-500/20 to-yellow-500/5' },
              { label: 'Streak Days', value: user.streak_days.toString(), icon: '🔥', color: 'from-red-500/20 to-red-500/5' },
              { label: 'Level', value: user.human_level.toString(), icon: '🏆', color: 'from-purple-500/20 to-purple-500/5' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} hover:border-primary/30 transition-all cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* My Sectors */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">My Sectors</h3>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>+</span>
                <span>Create Sector</span>
              </button>
            </div>

            {sectors.length === 0 ? (
              <motion.div
                className="p-12 rounded-xl border border-white/10 bg-black/20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🚀</div>
                <h4 className="text-2xl font-bold text-white mb-2">No sectors yet</h4>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  Create your first sector to start organizing your life and tracking your progress with AI-powered insights.
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-8 py-4 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all inline-flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Create First Sector</span>
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectors.map((sector, idx) => (
                  <motion.div
                    key={sector.id}
                    className="group p-6 rounded-xl border border-white/10 bg-black/20 hover:border-primary/30 transition-all cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleSectorClick(sector.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{sector.icon}</div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${sector.color}20`, color: sector.color }}>
                        Active
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {sector.name}
                    </h4>
                    
                    {sector.description && (
                      <p className="text-sm text-white/60 mb-4 line-clamp-2">{sector.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white font-medium">View Stats →</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modals */}
      <CreateSectorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchSectors}
      />

      <SectorDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        sectorId={selectedSectorId}
      />
    </div>
  );
};

export default Dashboard;
