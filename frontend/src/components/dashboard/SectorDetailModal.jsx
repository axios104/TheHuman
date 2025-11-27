import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sectorAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const SectorDetailModal = ({ isOpen, onClose, sectorId }) => {
  const navigate = useNavigate();
  const [sector, setSector] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    if (isOpen && sectorId) {
      fetchData();
    }
  }, [isOpen, sectorId, timeframe]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sectorRes, analyticsRes] = await Promise.all([
        sectorAPI.getById(sectorId),
        sectorAPI.getAnalytics(sectorId, timeframe)
      ]);
      setSector(sectorRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching sector data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-dark border border-primary/50 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-medium text-sm mb-1">{label}</p>
          <p className="text-primary font-bold text-lg">{payload[0].value} activities</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-dark border border-primary/50 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-medium text-sm mb-1">{payload[0].name}</p>
          <p className="text-primary font-bold text-lg">{payload[0].value} goals</p>
        </div>
      );
    }
    return null;
  };

  const pieData = analytics ? [
    { name: 'Completed', value: analytics.completed_goals, color: '#10b981' },
    { name: 'In Progress', value: analytics.total_goals - analytics.completed_goals, color: '#6b7280' }
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="text-white text-xl">Loading analytics...</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header - Fixed */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{sector.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{sector.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
                            backgroundColor: `${sector.color}20`, 
                            color: sector.color 
                          }}>
                            {sector.sector_type}
                          </span>
                          <span className="text-xs text-white/60">{sector.description}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="size-10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-4">
                    
                    {/* Timeframe Selector */}
                    <div className="flex justify-between items-center mb-4">
                      <button
                        onClick={() => {
                          navigate(`/sector/${sectorId}`);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all text-sm"
                      >
                        Open Chat →
                      </button>
                      <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                        {['week', 'month', 'year', 'all'].map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { label: 'Activities', value: analytics.message_count, icon: '📊', color: 'bg-blue-500/10' },
                        { label: 'Goals', value: analytics.total_goals, icon: '🎯', color: 'bg-purple-500/10' },
                        { label: 'Completed', value: analytics.completed_goals, icon: '✓', color: 'bg-green-500/10' },
                        { label: 'Progress', value: `${analytics.progress}%`, icon: '📈', color: 'bg-orange-500/10' }
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          className={`p-3 rounded-lg border border-white/10 ${stat.color} hover:scale-105 transition-transform cursor-pointer`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ borderColor: sector.color }}
                        >
                          <div className="text-2xl mb-1">{stat.icon}</div>
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs text-white/60">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      
                      {/* Activity Area Chart */}
                      <motion.div
                        className="p-4 rounded-xl border border-white/10 bg-black/20 hover:border-primary/30 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <span>📈</span>
                          <span>Activity Over Time</span>
                        </h3>
                        {analytics.activity_data.length > 0 ? (
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={analytics.activity_data}>
                              <defs>
                                <linearGradient id={`colorActivity${sectorId}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={sector.color} stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor={sector.color} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis 
                                dataKey="date" 
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                              />
                              <YAxis 
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="count" 
                                stroke={sector.color}
                                strokeWidth={2}
                                fill={`url(#colorActivity${sectorId})`}
                                activeDot={{ r: 6, fill: sector.color }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-[200px] flex flex-col items-center justify-center text-white/50 border border-dashed border-white/10 rounded-lg">
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-sm">No activity data yet</p>
                          </div>
                        )}
                      </motion.div>

                      {/* Goals Progress Pie Chart */}
                      <motion.div
                        className="p-4 rounded-xl border border-white/10 bg-black/20 hover:border-primary/30 transition-all"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                          <span>🎯</span>
                          <span>Goals Progress</span>
                        </h3>
                        {analytics.total_goals > 0 ? (
                          <div className="relative">
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={entry.color}
                                      className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                  ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <div className="text-4xl font-bold text-white">{analytics.progress}%</div>
                              <div className="text-xs text-white/60 mt-1">Complete</div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-[200px] flex flex-col items-center justify-center text-white/50 border border-dashed border-white/10 rounded-lg">
                            <div className="text-4xl mb-2">🎯</div>
                            <p className="text-sm">No goals yet</p>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Summary Stats Bar */}
                    <motion.div
                      className="p-4 rounded-xl border border-white/10 bg-gradient-to-r from-primary/10 to-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-bold text-white mb-3">Quick Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center">
                          <div className="text-2xl mb-1">💬</div>
                          <div className="text-lg font-bold text-white">{analytics.message_count}</div>
                          <div className="text-xs text-white/60">Messages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">🔥</div>
                          <div className="text-lg font-bold text-white">{analytics.activity_data.length}</div>
                          <div className="text-xs text-white/60">Active Days</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">✅</div>
                          <div className="text-lg font-bold text-white">{analytics.completed_goals}</div>
                          <div className="text-xs text-white/60">Done</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-1">⏰</div>
                          <div className="text-lg font-bold text-white">{analytics.total_goals - analytics.completed_goals}</div>
                          <div className="text-xs text-white/60">Pending</div>
                        </div>
                      </div>
                    </motion.div>

                  </div>

                  {/* Footer - Fixed */}
                  <div className="border-t border-white/10 p-4 bg-white/5 flex items-center justify-between flex-shrink-0">
                    <div className="text-sm text-white/60">
                      Showing <span className="text-white font-medium">{timeframe}</span> data
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/sector/${sectorId}`);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all text-sm"
                      >
                        Go to Chat
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SectorDetailModal;
