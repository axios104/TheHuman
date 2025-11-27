import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, sectorAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';
import CreateSectorModal from '../components/dashboard/CreateSectorModal';
import SectorDetailModal from '../components/dashboard/SectorDetailModal';

const SectorsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
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

  const sectorTypes = ['all', 'HEALTH', 'FINANCE', 'CAREER', 'RELATIONSHIPS', 'LEARNING', 'CREATIVITY', 'MENTAL_HEALTH'];

  const filteredSectors = filter === 'all' 
    ? sectors 
    : sectors.filter(s => s.sector_type === filter);

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Sectors</h1>
              <p className="text-white/60">Manage and organize your life sectors</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Create New Sector</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {sectorTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === type
                    ? 'bg-primary text-background-dark'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {type === 'all' ? 'All Sectors' : type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Sectors Grid */}
          {filteredSectors.length === 0 ? (
            <motion.div
              className="p-12 rounded-xl border border-white/10 bg-black/20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-2">No sectors found</h3>
              <p className="text-white/60 mb-6">
                {filter === 'all' 
                  ? 'Create your first sector to get started'
                  : `No ${filter.toLowerCase()} sectors yet`}
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
              >
                Create Sector
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSectors.map((sector, idx) => (
                <motion.div
                  key={sector.id}
                  className="group p-6 rounded-xl border border-white/10 bg-black/20 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSectorClick(sector.id)}
                >
                  {/* Background glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity blur-xl"
                    style={{ backgroundColor: sector.color }}
                  />

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{sector.icon}</div>
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${sector.color}20`, 
                          color: sector.color 
                        }}
                      >
                        {sector.sector_type}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {sector.name}
                    </h3>
                    
                    {/* Description */}
                    {sector.description && (
                      <p className="text-sm text-white/60 mb-4 line-clamp-2">
                        {sector.description}
                      </p>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                      <div className="flex items-center gap-1">
                        <span>💬</span>
                        <span>0 chats</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🎯</span>
                        <span>0 goals</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white font-medium group-hover:text-primary transition-colors">
                          View Analytics →
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: sector.color }}
                          initial={{ width: 0 }}
                          animate={{ width: '0%' }}
                        />
                      </div>
                    </div>

                    {/* Quick Actions on Hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sector/${sector.id}`);
                        }}
                        className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                        title="Open Chat"
                      >
                        <span className="text-white">💬</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {sectors.length > 0 && (
            <motion.div
              className="mt-12 p-6 rounded-xl border border-white/10 bg-gradient-to-r from-primary/10 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Your Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-3xl font-bold text-white">{sectors.length}</div>
                  <div className="text-sm text-white/60">Total Sectors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-3xl font-bold text-white">{sectors.filter(s => s.is_active).length}</div>
                  <div className="text-sm text-white/60">Active Sectors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-3xl font-bold text-white">0</div>
                  <div className="text-sm text-white/60">Total Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <div className="text-3xl font-bold text-white">0</div>
                  <div className="text-sm text-white/60">Total Messages</div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Create Sector Modal */}
      <CreateSectorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchSectors}
      />

      {/* Sector Detail Modal */}
      <SectorDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        sectorId={selectedSectorId}
      />
    </div>
  );
};

export default SectorsPage;
