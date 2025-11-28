import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';
import axios from 'axios';

const BadgesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState('all');
  const [progress, setProgress] = useState(null);

  const badgeDefinitions = [
    {
      id: 1,
      key: "profile_complete",
      name: "First Steps",
      description: "Complete your profile",
      icon: "🎯",
      color: "#10b981",
      gradient: "from-green-500/20 to-green-500/5",
      rarity: "Common",
      points: 10,
      checkValue: 1,
      howToEarn: "Sign up and complete your profile information including name and email."
    },
    {
      id: 2,
      key: "sectors_created",
      name: "Sector Master",
      description: "Create 5 sectors",
      icon: "📊",
      color: "#06b6d4",
      gradient: "from-cyan-500/20 to-cyan-500/5",
      rarity: "Rare",
      points: 50,
      checkValue: 5,
      howToEarn: "Create and customize 5 different life sectors to organize your goals."
    },
    {
      id: 3,
      key: "goals_completed",
      name: "Goal Crusher",
      description: "Complete 10 goals",
      icon: "💪",
      color: "#f59e0b",
      gradient: "from-amber-500/20 to-amber-500/5",
      rarity: "Epic",
      points: 100,
      checkValue: 10,
      howToEarn: "Set goals in your sectors and mark them as complete. You need to complete 10 goals total."
    },
    {
      id: 4,
      key: "streak_days",
      name: "Streak Legend",
      description: "Maintain 30-day streak",
      icon: "🔥",
      color: "#ef4444",
      gradient: "from-red-500/20 to-red-500/5",
      rarity: "Legendary",
      points: 300,
      checkValue: 30,
      howToEarn: "Log in and engage with the app every single day for 30 consecutive days."
    },
    {
      id: 5,
      key: "ai_conversations",
      name: "AI Conversationalist",
      description: "Have 50 AI conversations",
      icon: "🤖",
      color: "#8b5cf6",
      gradient: "from-purple-500/20 to-purple-500/5",
      rarity: "Rare",
      points: 75,
      checkValue: 50,
      howToEarn: "Use the AI Advisor to have meaningful conversations. Each conversation counts when you send at least 5 messages."
    },
    {
      id: 6,
      key: "zone_out_uses",
      name: "Zone Out Master",
      description: "Use Zone Out 20 times",
      icon: "✨",
      color: "#ec4899",
      gradient: "from-pink-500/20 to-pink-500/5",
      rarity: "Epic",
      points: 150,
      checkValue: 20,
      howToEarn: "Visit the Zone Out page and analyze your thoughts using AI. Each analysis session counts."
    },
    {
      id: 7,
      key: "news_articles_read",
      name: "Knowledge Seeker",
      description: "Read 100 news articles",
      icon: "📰",
      color: "#10b981",
      gradient: "from-emerald-500/20 to-emerald-500/5",
      rarity: "Rare",
      points: 80,
      checkValue: 100,
      howToEarn: "Stay informed by reading articles in the News Feed. Click through and read articles to make progress."
    },
    {
      id: 8,
      key: "user_level",
      name: "Level 10 Human",
      description: "Reach level 10",
      icon: "🏆",
      color: "#f59e0b",
      gradient: "from-yellow-500/20 to-yellow-500/5",
      rarity: "Legendary",
      points: 500,
      checkValue: 10,
      howToEarn: "Gain experience points by completing goals, maintaining streaks, and engaging with all features. Level up by earning points!"
    }
  ];

  useEffect(() => {
    fetchUserData();
    fetchProgress();
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

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/badges/check-progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  if (loading || !progress) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Calculate badges with real progress
  const badges = badgeDefinitions.map(badge => {
    const currentProgress = progress[badge.key];
    const earned = currentProgress >= badge.checkValue;
    return {
      ...badge,
      earned,
      progress: currentProgress,
      total: badge.checkValue
    };
  });

  const filteredBadges = badges.filter(badge => {
    if (filter === 'earned') return badge.earned;
    if (filter === 'locked') return !badge.earned;
    return true;
  });

  const earnedCount = badges.filter(b => b.earned).length;
  const totalPoints = badges.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0);

  const rarityColors = {
    Common: { bg: '#6b728020', text: '#9ca3af', border: '#6b7280' },
    Rare: { bg: '#06b6d420', text: '#06b6d4', border: '#06b6d4' },
    Epic: { bg: '#8b5cf620', text: '#a78bfa', border: '#8b5cf6' },
    Legendary: { bg: '#f59e0b20', text: '#fbbf24', border: '#f59e0b' }
  };

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                  <span>🏆</span>
                  <span>Badges & Achievements</span>
                </h1>
                <p className="text-white/60 text-sm">Collect badges as you progress</p>
              </div>
              
              <button
                className="size-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/20 transition-all text-sm font-bold"
                title="About Badges"
                onClick={() => alert("Badges are earned by completing various activities in HUMAN. Click any badge to learn how to earn it!")}
              >
                i
              </button>
            </div>

            {/* Stats - Compact */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
                <div className="text-2xl mb-1">🎖️</div>
                <div className="text-2xl font-bold text-white">{earnedCount}/{badges.length}</div>
                <div className="text-xs text-white/60">Earned</div>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-yellow-500/10 to-transparent">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-2xl font-bold text-white">{totalPoints}</div>
                <div className="text-xs text-white/60">Points</div>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="text-2xl mb-1">🔓</div>
                <div className="text-2xl font-bold text-white">{badges.length - earnedCount}</div>
                <div className="text-xs text-white/60">Locked</div>
              </div>
            </div>
          </motion.div>

          {/* Filter - Compact */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All' },
              { id: 'earned', label: 'Earned' },
              { id: 'locked', label: 'Locked' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${
                  filter === f.id
                    ? 'bg-primary text-background-dark'
                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Badges Grid - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                className={`relative group p-4 rounded-xl border transition-all cursor-pointer ${
                  badge.earned
                    ? `border-white/20 bg-gradient-to-br ${badge.gradient} hover:scale-105`
                    : 'border-white/10 bg-black/20 opacity-60 hover:opacity-100'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedBadge(badge)}
              >
                {/* Info Button - Small */}
                <button
                  className="absolute top-2 right-2 size-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10 text-xs font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBadge(badge);
                  }}
                >
                  i
                </button>

                {/* Badge Icon - Compact */}
                <div className={`text-5xl mb-2 ${!badge.earned && 'grayscale'}`}>
                  {badge.icon}
                </div>

                {/* Badge Name - Compact */}
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{badge.name}</h3>
                
                {/* Rarity - Compact */}
                <div 
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-2"
                  style={{ 
                    backgroundColor: rarityColors[badge.rarity].bg,
                    color: rarityColors[badge.rarity].text
                  }}
                >
                  {badge.rarity}
                </div>

                {/* Progress or Status - Compact */}
                {badge.earned ? (
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <span>✓</span>
                    <span className="font-medium">Earned</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/60">{badge.progress}/{badge.total}</span>
                      <span className="text-white font-medium">{Math.round((badge.progress/badge.total)*100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(badge.progress / badge.total) * 100}%`,
                          backgroundColor: badge.color
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Points - Compact */}
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-white/40">Points</span>
                  <span className="text-sm font-bold text-primary">+{badge.points}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Badge Detail Modal - SMALLER */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setSelectedBadge(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm rounded-xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
                style={{ borderColor: selectedBadge.color + '40' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 text-center">
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="absolute top-3 right-3 size-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    ✕
                  </button>

                  <div className={`text-6xl mb-3 ${!selectedBadge.earned && 'grayscale'}`}>
                    {selectedBadge.icon}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-1">{selectedBadge.name}</h2>

                  <div 
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                    style={{ 
                      backgroundColor: rarityColors[selectedBadge.rarity].bg,
                      color: rarityColors[selectedBadge.rarity].text
                    }}
                  >
                    {selectedBadge.rarity} • +{selectedBadge.points} Points
                  </div>

                  <p className="text-white/60 text-sm mb-4">{selectedBadge.description}</p>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-left mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">💡</span>
                      <span className="font-bold text-white text-sm">How to Earn:</span>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">{selectedBadge.howToEarn}</p>
                  </div>

                  {selectedBadge.earned ? (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
                      ✓ Earned!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white font-bold">{selectedBadge.progress} / {selectedBadge.total}</span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${(selectedBadge.progress / selectedBadge.total) * 100}%`,
                            backgroundColor: selectedBadge.color
                          }}
                        />
                      </div>
                      <p className="text-xs text-white/40">
                        {selectedBadge.total - selectedBadge.progress} more to go!
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="w-full mt-4 px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all text-sm"
                  >
                    Got It!
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgesPage;
