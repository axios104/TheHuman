import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';

const ZoneOutPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughts] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [mood, setMood] = useState('neutral');

  const moods = [
    { id: 'excited', emoji: '🚀', label: 'Excited', color: '#f59e0b' },
    { id: 'confused', emoji: '🤔', label: 'Confused', color: '#8b5cf6' },
    { id: 'creative', emoji: '✨', label: 'Creative', color: '#ec4899' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: '#ef4444' },
    { id: 'peaceful', emoji: '😌', label: 'Peaceful', color: '#10b981' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#6b7280' },
  ];

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

  const handleAnalyze = async () => {
    if (!thoughts.trim()) return;

    setIsAnalyzing(true);
    setShowResponse(false);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are a creative life coach and thinking partner. The user is in "${mood}" mood. Help them:
              1. Understand their thoughts and feelings
              2. See new perspectives they haven't considered
              3. Suggest practical next steps
              4. Encourage creative thinking
              5. Be empathetic, inspiring, and actionable
              
              Keep responses conversational, friendly, and under 200 words. Use emojis to make it engaging.`
            },
            {
              role: 'user',
              content: thoughts
            }
          ],
          temperature: 0.9,
          max_tokens: 500
        })
      });

      const data = await response.json();
      setAiResponse(data.choices[0].message.content);
      setShowResponse(true);
    } catch (error) {
      console.error('Error analyzing thoughts:', error);
      setAiResponse("I'm having trouble connecting right now. But here's what I think: Take a deep breath, break down your thoughts into smaller pieces, and tackle them one at a time. You've got this! 💪");
      setShowResponse(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setThoughts('');
    setAiResponse('');
    setShowResponse(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const selectedMoodData = moods.find(m => m.id === mood);

  return (
    <div className="min-h-screen bg-background-dark">
      <DashboardNav user={user} />

      <div className="pt-16 min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 size-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 size-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-7xl mb-6 animate-bounce">✨</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Zone Out
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A judgment-free space to dump your thoughts, dreams, and random ideas. 
              Let AI help you make sense of it all.
            </p>
          </motion.div>

          {/* Mood Selector */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-center text-white/60 mb-4">How are you feeling right now?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    mood === m.id
                      ? 'bg-white/10 scale-110 border-2'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  style={mood === m.id ? { borderColor: m.color } : {}}
                >
                  <span className="text-2xl mr-2">{m.emoji}</span>
                  <span className="text-white">{m.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 rounded-2xl border border-white/10 bg-black/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💭</span>
                  <span>Your Thoughts</span>
                </h2>
                
                <textarea
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  placeholder="What's on your mind? Write anything... ideas, problems, dreams, random thoughts. This is your space to think freely."
                  className="w-full h-80 px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none text-base leading-relaxed"
                />

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-white/40">
                    {thoughts.length} characters
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClear}
                      disabled={!thoughts.trim()}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-30"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleAnalyze}
                      disabled={!thoughts.trim() || isAnalyzing}
                      className="px-6 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all disabled:opacity-30 flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="size-4 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
                          <span>Thinking...</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>Analyze</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <p className="text-sm text-white/60 mb-3">Need inspiration? Try these:</p>
                <div className="space-y-2">
                  {[
                    "I have an idea but don't know where to start...",
                    "I'm feeling stuck in my current situation...",
                    "What if I could change one thing in my life?",
                    "I've been thinking about..."
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThoughts(prompt)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Response Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 rounded-2xl border border-white/10 bg-black/20 min-h-[500px] flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🤖</span>
                  <span>AI Insights</span>
                </h2>

                <AnimatePresence mode="wait">
                  {!showResponse ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center"
                    >
                      <div className="text-6xl mb-4" style={{ color: selectedMoodData.color }}>
                        {selectedMoodData.emoji}
                      </div>
                      <p className="text-white/60 max-w-xs">
                        Write your thoughts and I'll help you see things from a new perspective
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex-1"
                    >
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-white leading-relaxed whitespace-pre-wrap">
                          {aiResponse}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 space-y-3">
                        <button
                          onClick={() => {
                            setThoughts('');
                            setShowResponse(false);
                          }}
                          className="w-full px-4 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-all"
                        >
                          Start Fresh 🔄
                        </button>
                        <button
                          onClick={handleAnalyze}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                        >
                          Get Another Perspective 💡
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                <p className="text-sm text-white/60 leading-relaxed">
                  <span className="font-bold text-white">💡 Pro Tip:</span> The more honest and detailed you are, the better insights you'll get. This is your private space—no judgments, just support!
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ZoneOutPage;
