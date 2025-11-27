import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, goalAPI, sectorAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';
import CreateGoalModal from '../components/dashboard/CreateGoalModal';

const GoalsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    fetchUserData();
    fetchGoals();
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

  const fetchGoals = async () => {
    try {
      const response = await goalAPI.getAll();
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
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

  const handleToggleComplete = async (goalId) => {
    try {
      await goalAPI.complete(goalId);
      fetchGoals();
      fetchUserData(); // Refresh to get updated points
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await goalAPI.delete(goalId);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getSectorForGoal = (sectorId) => {
    return sectors.find(s => s.id === sectorId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.is_completed;
    if (filter === 'completed') return goal.is_completed;
    return true;
  });

  const activeGoals = goals.filter(g => !g.is_completed).length;
  const completedGoals = goals.filter(g => g.is_completed).length;
  const completionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Goals</h1>
              <p className="text-white/60">Track and achieve your objectives</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>New Goal</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Goals', value: goals.length, icon: '🎯', color: 'from-blue-500/20' },
              { label: 'Active', value: activeGoals, icon: '⏳', color: 'from-yellow-500/20' },
              { label: 'Completed', value: completedGoals, icon: '✅', color: 'from-green-500/20' },
              { label: 'Completion Rate', value: `${completionRate}%`, icon: '📈', color: 'from-purple-500/20' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className={`p-6 rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} to-transparent`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All Goals' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.id
                    ? 'bg-primary text-background-dark'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Goals List */}
          {filteredGoals.length === 0 ? (
            <motion.div
              className="p-12 rounded-xl border border-white/10 bg-black/20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {filter === 'completed' ? 'No completed goals yet' : 
                 filter === 'active' ? 'No active goals' : 
                 'No goals yet'}
              </h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Set goals within your sectors to track your progress and stay motivated
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
              >
                Create Your First Goal
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredGoals.map((goal, idx) => {
                const sector = getSectorForGoal(goal.sector_id);
                const progress = goal.target_value 
                  ? Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
                  : 0;

                return (
                  <motion.div
                    key={goal.id}
                    className={`p-6 rounded-xl border transition-all ${
                      goal.is_completed
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-white/10 bg-black/20 hover:border-primary/30'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleComplete(goal.id)}
                        className={`flex-shrink-0 size-6 rounded-lg border-2 transition-all ${
                          goal.is_completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/30 hover:border-primary'
                        } flex items-center justify-center`}
                      >
                        {goal.is_completed && (
                          <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Title & Sector */}
                        <div className="flex items-start gap-3 mb-2">
                          {sector && (
                            <span className="text-2xl">{sector.icon}</span>
                          )}
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-1 ${
                              goal.is_completed ? 'text-white/60 line-through' : 'text-white'
                            }`}>
                              {goal.title}
                            </h3>
                            {sector && (
                              <span 
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{ backgroundColor: `${sector.color}20`, color: sector.color }}
                              >
                                {sector.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {goal.description && (
                          <p className="text-sm text-white/60 mb-4">{goal.description}</p>
                        )}

                        {/* Progress Bar */}
                        {goal.target_value && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-white/60">
                                {goal.current_value} / {goal.target_value} {goal.unit}
                              </span>
                              <span className="text-white font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${progress}%`,
                                  backgroundColor: sector?.color || '#0df2f2'
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer Info */}
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <div>Created {new Date(goal.created_at).toLocaleDateString()}</div>
                          {goal.deadline && (
                            <div>Deadline: {new Date(goal.deadline).toLocaleDateString()}</div>
                          )}
                          {goal.is_completed && goal.completed_at && (
                            <div className="text-green-400">
                              ✓ Completed {new Date(goal.completed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="flex-shrink-0 p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchGoals}
      />
    </div>
  );
};

export default GoalsPage;
