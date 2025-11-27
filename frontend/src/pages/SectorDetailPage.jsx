import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI, sectorAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';

const SectorDetailPage = () => {
  const navigate = useNavigate();
  const { sectorId } = useParams();
  const messagesEndRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [sector, setSector] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchSectorData();
    fetchMessages();
  }, [sectorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchSectorData = async () => {
    try {
      const response = await sectorAPI.getById(sectorId);
      setSector(response.data);
    } catch (error) {
      console.error('Error fetching sector:', error);
      if (error.response?.status === 404) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await sectorAPI.getMessages(sectorId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      is_user: true,
      created_at: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sectorAPI.sendMessage(sectorId, inputMessage);
      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!sector) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <DashboardNav user={user} />

      {/* Sector Header */}
      <div className="pt-16 border-b border-white/10 bg-background-dark/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/sectors')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div className="text-4xl">{sector.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">{sector.name}</h1>
                <p className="text-sm text-white/60">{sector.sector_type} • AI-powered guidance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm">
                📊 Stats
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm">
                🎯 Goals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">{sector.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">Start Your Journey</h2>
              <p className="text-white/60 max-w-md">
                Share your thoughts, track your progress, or ask questions about {sector.name.toLowerCase()}.
                Your AI assistant is here to help.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id || idx}
                  className={`flex ${message.is_user ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className={`max-w-[70%] ${message.is_user ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-6 py-4 ${
                      message.is_user 
                        ? 'bg-primary text-background-dark' 
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
      <div className="border-t border-white/10 bg-background-dark/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end gap-4">
            <button className="p-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              📎
            </button>
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
                placeholder={`Share your progress in ${sector.name.toLowerCase()}...`}
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none"
                rows={3}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-4 rounded-xl bg-primary text-background-dark font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            AI responses are contextual and based on your {sector.sector_type.toLowerCase()} data
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectorDetailPage;
