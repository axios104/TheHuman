import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, sectorAPI, goalAPI } from '../utils/api';
import toast from 'react-hot-toast';
import DashboardNav from '../components/dashboard/DashboardNav';
import CreateSectorModal from '../components/dashboard/CreateSectorModal';
import CreateGoalModal from '../components/dashboard/CreateGoalModal';
import SectorDetailModal from '../components/dashboard/SectorDetailModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSectorModal, setShowCreateSectorModal] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [showSectorDetailModal, setShowSectorDetailModal] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchSectors();
    fetchGoals();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      console.log('User data:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await sectorAPI.getAll();
      console.log('Fetched sectors:', response.data);
      setSectors(response.data || []);
      if (response.data && response.data.length > 0) {
        toast.success(`Loaded ${response.data.length} sectors`, { duration: 2000 });
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast.error('Failed to load sectors');
      setSectors([]);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await goalAPI.getAll();
      console.log('Fetched goals:', response.data);
      setGoals(response.data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
      setGoals([]);
    }
  };

  const handleSectorCreated = () => {
    toast.success('✨ Sector created successfully!');
    fetchSectors();
  };

  const handleGoalCreated = () => {
    toast.success('🎯 Goal created successfully!');
    fetchGoals();
  };

  const handleSectorClick = (sectorId) => {
    setSelectedSectorId(sectorId);
    setShowSectorDetailModal(true);
  };

  const handleToggleComplete = async (goalId, currentStatus) => {
    try {
      if (!currentStatus) {
        await goalAPI.complete(goalId);
        toast.success('🎉 Goal completed! Great job!');
      } else {
        await goalAPI.update(goalId, { is_completed: false });
        toast.success('Goal reopened');
      }
      fetchGoals();
    } catch (error) {
      console.error('Error toggling goal:', error);
      toast.error('Failed to update goal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-white text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const recentGoals = goals.slice(0, 5);
  const completedGoalsCount = goals.filter(g => g.is_completed).length;
  const completionRate = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Welcome Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user.full_name}! 👋
            </h1>
            <p className="text-white/60 text-lg">
              Here's your progress overview
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📊</div>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{sectors.length}</div>
              <div className="text-sm text-white/60">Active Sectors</div>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🎯</div>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">Total</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{goals.length}</div>
              <div className="text-sm text-white/60">Goals Set</div>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-yellow-500/10 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🔥</div>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">Days</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{user.streak_days}</div>
              <div className="text-sm text-white/60">Day Streak</div>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">⭐</div>
                <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">Level {user.human_level}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{user.total_points}</div>
              <div className="text-sm text-white/60">Total Points</div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sectors Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Sectors</h2>
                  <button
                    onClick={() => setShowCreateSectorModal(true)}
                    className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <span>+</span>
                    <span>New Sector</span>
                  </button>
                </div>

                {sectors.length === 0 ? (
                  <div className="p-12 rounded-xl border border-dashed border-white/20 bg-white/5 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-bold text-white mb-2">No Sectors Yet</h3>
                    <p className="text-white/60 mb-6">Create your first sector to start organizing your life</p>
                    <button
                      onClick={() => setShowCreateSectorModal(true)}
                      className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                    >
                      Create First Sector
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectors.map((sector, idx) => (
                      <motion.div
                        key={sector.id}
                        className="group p-6 rounded-xl border border-white/10 bg-black/20 hover:border-primary/30 transition-all cursor-pointer"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSectorClick(sector.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl">{sector.icon}</div>
                          <div 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ 
                              backgroundColor: `${sector.color}20`, 
                              color: sector.color 
                            }}
                          >
                            {sector.sector_type}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                          {sector.name}
                        </h3>
                        {sector.description && (
                          <p className="text-sm text-white/60 line-clamp-2 mb-4">
                            {sector.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>Click to view details</span>
                          <span>→</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Recent Goals Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Recent Goals</h2>
                  <button
                    onClick={() => setShowCreateGoalModal(true)}
                    className="size-10 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Completion Rate */}
                {goals.length > 0 && (
                  <div className="mb-6 p-4 rounded-xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Completion Rate</span>
                      <span className="text-lg font-bold text-primary">{completionRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Goals List */}
                <div className="space-y-3">
                  {recentGoals.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-white/20 bg-white/5 text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <p className="text-sm text-white/60">No goals yet</p>
                    </div>
                  ) : (
                    recentGoals.map((goal, idx) => (
                      <motion.div
                        key={goal.id}
                        className={`p-4 rounded-xl border transition-all ${
                          goal.is_completed
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-white/10 bg-black/20 hover:border-primary/30'
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleComplete(goal.id, goal.is_completed)}
                            className={`mt-1 size-5 rounded border-2 flex items-center justify-center transition-all ${
                              goal.is_completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-white/30 hover:border-primary'
                            }`}
                          >
                            {goal.is_completed && (
                              <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium mb-1 ${
                              goal.is_completed ? 'text-white/50 line-through' : 'text-white'
                            }`}>
                              {goal.title}
                            </h4>
                            {goal.deadline && (
                              <p className="text-xs text-white/40">
                                Due: {new Date(goal.deadline).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {goals.length > 5 && (
                  <button
                    onClick={() => navigate('/goals')}
                    className="w-full mt-4 py-3 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
                  >
                    View All Goals →
                  </button>
                )}
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <CreateSectorModal
        isOpen={showCreateSectorModal}
        onClose={() => setShowCreateSectorModal(false)}
        onSuccess={handleSectorCreated}
      />

      <CreateGoalModal
        isOpen={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
        onSuccess={handleGoalCreated}
      />

      <SectorDetailModal
        isOpen={showSectorDetailModal}
        onClose={() => setShowSectorDetailModal(false)}
        sectorId={selectedSectorId}
      />
    </div>
  );
};

export default Dashboard;
