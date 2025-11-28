import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, sectorAPI } from '../utils/api';
import toast from 'react-hot-toast';
import DashboardNav from '../components/dashboard/DashboardNav';

const SectorChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sector, setSector] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    fetchSectorData();
    fetchMessages();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      }
    }
  };

  const fetchSectorData = async () => {
    try {
      const response = await sectorAPI.getById(id);
      console.log('Sector data:', response.data);
      setSector(response.data);
    } catch (error) {
      console.error('Error fetching sector:', error);
      toast.error('Failed to load sector');
      navigate('/sectors');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await sectorAPI.getMessages(id);
      console.log('Messages:', response.data);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSystemPrompt = (sectorType) => {
    const prompts = {
      HEALTH: "You are a health and wellness coach. Provide evidence-based advice on fitness, nutrition, and overall wellbeing. Be supportive and motivating.",
      FINANCE: "You are a financial advisor. Help with budgeting, saving, investing, and financial planning. Provide practical, actionable advice.",
      CAREER: "You are a career coach. Provide guidance on professional development, job searching, and career advancement. Be encouraging and strategic.",
      RELATIONSHIPS: "You are a relationships counselor. Offer empathetic advice on interpersonal relationships and communication.",
      LEARNING: "You are a learning mentor. Help with study strategies, skill development, and knowledge acquisition.",
      CREATIVITY: "You are a creativity coach. Help unlock creative potential and provide artistic guidance.",
      FITNESS: "You are a fitness trainer. Provide workout plans, exercise guidance, and motivation.",
      MENTAL_HEALTH: "You are a mental wellness guide. Provide advice on stress management, mindfulness, and emotional wellbeing."
    };
    return prompts[sectorType] || "You are a helpful AI assistant.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sector) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      is_user: true,
      created_at: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Save user message to backend
      await sectorAPI.sendMessage(id, inputMessage);

      // Call AI
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: getSystemPrompt(sector.sector_type) },
            ...messages.map(m => ({
              role: m.is_user ? 'user' : 'assistant',
              content: m.content
            })),
            { role: 'user', content: inputMessage }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        content: data.choices[0].message.content,
        is_user: false,
        ai_model: 'llama-3.1-8b',
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI message to backend
      // Note: You might need to create a separate endpoint for this
      // await sectorAPI.saveAIMessage(id, aiMessage.content);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      const errorMessage = {
        id: Date.now() + 1,
        content: "I apologize, but I'm having trouble connecting right now. Please try again.",
        is_user: false,
        created_at: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-white text-xl">Loading sector...</p>
        </div>
      </div>
    );
  }

  if (!sector) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <DashboardNav user={user} />

      <div className="flex-1 flex flex-col pt-16">
        
        {/* Header */}
        <div className="border-b border-white/10 bg-background-dark/80 backdrop-blur-sm sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/sectors')}
                  className="size-10 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{sector.icon}</span>
                    <h1 className="text-2xl font-bold text-white">{sector.name}</h1>
                  </div>
                  {sector.description && (
                    <p className="text-sm text-white/60 mt-1">{sector.description}</p>
                  )}
                </div>
              </div>
              <div 
                className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ 
                  backgroundColor: `${sector.color}20`, 
                  color: sector.color 
                }}
              >
                {sector.sector_type}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="text-7xl mb-6">{sector.icon}</div>
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-3">Start Your Conversation</h2>
                <p className="text-white/60 max-w-md mb-8 text-lg">
                  Ask me anything about {sector.name.toLowerCase()}. I'm here to help you grow!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  {[
                    "What should I focus on this week?",
                    "Help me set a new goal",
                    "Give me personalized advice",
                    "How can I improve?"
                  ].map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setInputMessage(suggestion)}
                      className="px-5 py-4 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-primary/30 transition-all text-sm font-medium text-left"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className={`max-w-[80%] ${message.is_user ? 'order-2' : 'order-1'}`}>
                      {!message.is_user && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{sector.icon}</span>
                          <span className="text-xs text-white/60 font-medium">{sector.name} AI</span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-6 py-4 ${
                        message.is_user 
                          ? 'bg-primary text-background-dark' 
                          : message.error
                          ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                          : 'bg-white/5 border border-white/10 text-white'
                      }`}>
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className={`text-xs text-white/40 mt-2 ${message.is_user ? 'text-right' : 'text-left'}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-background-dark/95 backdrop-blur-sm sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask about ${sector.name.toLowerCase()}...`}
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none text-base"
                  rows={3}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-8 py-4 rounded-xl bg-primary text-background-dark font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ backgroundColor: sector.color }}
              >
                <span>Send</span>
                <span>✨</span>
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-white/40">
                Powered by AI • {sector.sector_type}
              </p>
              <p className="text-xs text-white/40">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorChatPage;
