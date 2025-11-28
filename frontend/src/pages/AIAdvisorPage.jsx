import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, conversationAPI } from '../utils/api';
import DashboardNav from '../components/dashboard/DashboardNav';

const AIAdvisorPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b');
  const [selectedField, setSelectedField] = useState('general');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const messagesEndRef = useRef(null);

  // Conversation history
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const aiModels = [
    { 
      id: 'llama-3.3-70b', 
      name: 'Llama 3.3 70B', 
      provider: 'Meta',
      description: 'Most powerful, best for complex reasoning',
      icon: '🦙',
      speed: 'Moderate'
    },
    { 
      id: 'llama-3.1-8b', 
      name: 'Llama 3.1 8B', 
      provider: 'Meta',
      description: 'Lightning fast, great for quick answers',
      icon: '⚡',
      speed: 'Very Fast'
    },
    { 
      id: 'mixtral-8x7b', 
      name: 'Mixtral 8x7B', 
      provider: 'Mistral AI',
      description: 'Excellent reasoning and detailed analysis',
      icon: '🧠',
      speed: 'Fast'
    },
    { 
      id: 'gemma-2-9b', 
      name: 'Gemma 2 9B', 
      provider: 'Google',
      description: 'Balanced performance and accuracy',
      icon: '💎',
      speed: 'Fast'
    }
  ];

  const fields = [
    { id: 'general', name: 'General Advice', icon: '💬', color: '#6b7280', description: 'Any topic or question' },
    { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#10b981', description: 'Wellness, nutrition, exercise' },
    { id: 'finance', name: 'Finance & Money', icon: '💰', color: '#f59e0b', description: 'Budgeting, investing, savings' },
    { id: 'career', name: 'Career & Work', icon: '🚀', color: '#8b5cf6', description: 'Professional development' },
    { id: 'relationships', name: 'Relationships', icon: '❤️', color: '#ef4444', description: 'Personal connections' },
    { id: 'learning', name: 'Learning & Skills', icon: '📚', color: '#06b6d4', description: 'Education and growth' },
    { id: 'mental', name: 'Mental Health', icon: '🧘', color: '#ec4899', description: 'Mindfulness and wellbeing' },
    { id: 'creativity', name: 'Creativity & Arts', icon: '🎨', color: '#f43f5e', description: 'Creative pursuits' }
  ];

  useEffect(() => {
    fetchUserData();
    fetchConversations();
  }, []);

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
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await conversationAPI.getAll();
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await conversationAPI.getMessages(conversationId);
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.role === 'user',
        timestamp: msg.created_at,
        model: msg.model_used
      }));
      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
      setShowConfig(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const title = `${selectedFieldData.name} - ${new Date().toLocaleDateString()}`;
      const response = await conversationAPI.create({ title });
      setCurrentConversationId(response.data.id);
      setMessages([]);
      setShowConfig(false);
      fetchConversations();
    } catch (error) {
      if (error.response?.status === 400) {
        setShowLimitModal(true);
      }
      console.error('Error creating conversation:', error);
    }
  };

  const handleStartConversation = async () => {
    if (conversations.length >= 5) {
      setShowLimitModal(true);
      return;
    }
    await createNewConversation();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSystemPrompt = (field) => {
    const prompts = {
      general: "You are a wise and helpful AI advisor. Provide thoughtful, balanced advice on any topic. Be conversational and supportive.",
      health: "You are a health and wellness expert. Provide evidence-based advice on fitness, nutrition, and overall wellbeing. Always recommend consulting healthcare professionals for medical issues.",
      finance: "You are a financial advisor. Help with budgeting, saving, investing, and financial planning. Provide practical, actionable advice. Remind users to consult certified financial advisors for major decisions.",
      career: "You are an experienced career coach. Provide guidance on professional development, job searching, skills building, and career advancement. Be motivating and practical.",
      relationships: "You are a compassionate relationships counselor. Offer empathetic advice on interpersonal relationships, communication, and personal growth.",
      learning: "You are an educational mentor. Help with learning strategies, skill development, and knowledge acquisition. Make learning engaging and achievable.",
      mental: "You are a supportive mental wellness guide. Provide advice on stress management, mindfulness, and emotional wellbeing. Always recommend professional help for serious mental health issues.",
      creativity: "You are an inspiring creativity coach. Help unlock creative potential, provide artistic guidance, and encourage innovative thinking."
    };
    return prompts[field] || prompts.general;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create conversation if doesn't exist
    if (!currentConversationId) {
      try {
        const title = inputMessage.slice(0, 50) + (inputMessage.length > 50 ? '...' : '');
        const response = await conversationAPI.create({ title });
        setCurrentConversationId(response.data.id);
        fetchConversations();
      } catch (error) {
        if (error.response?.status === 400) {
          setShowLimitModal(true);
          return;
        }
      }
    }

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    
    // Save user message to DB
    if (currentConversationId) {
      await conversationAPI.addMessage(currentConversationId, {
        role: 'user',
        content: inputMessage
      });
    }

    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel === 'llama-3.3-70b' ? 'llama-3.3-70b-versatile' : 
                 selectedModel === 'llama-3.1-8b' ? 'llama-3.1-8b-instant' :
                 selectedModel === 'mixtral-8x7b' ? 'mixtral-8x7b-32768' :
                 'gemma2-9b-it',
          messages: [
            { role: 'system', content: getSystemPrompt(selectedField) },
            ...messages.map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.content
            })),
            { role: 'user', content: inputMessage }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        content: data.choices[0].message.content,
        isUser: false,
        timestamp: new Date().toISOString(),
        model: selectedModel
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI message to DB
      if (currentConversationId) {
        await conversationAPI.addMessage(currentConversationId, {
          role: 'assistant',
          content: data.choices[0].message.content,
          model_used: selectedModel
        });
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: "I apologize, but I'm having trouble connecting right now. Please make sure you've set up your Groq API key in the .env file.",
        isUser: false,
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await conversationAPI.delete(conversationId);
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
        setShowConfig(true);
      }
      fetchConversations();
      setShowDeleteModal(false);
      setConversationToDelete(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleRenameConversation = async (conversationId, newTitle) => {
    try {
      await conversationAPI.update(conversationId, { title: newTitle });
      fetchConversations();
      setEditingConversationId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const selectedModelData = aiModels.find(m => m.id === selectedModel);
  const selectedFieldData = fields.find(f => f.id === selectedField);

  return (
    <div className="min-h-screen bg-background-dark flex flex-col">
      <DashboardNav user={user} />

      <div className="flex-1 flex pt-16">
        
        {/* Sidebar - Conversation History */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 border-r border-white/10 bg-black/20 flex flex-col"
            >
              <div className="p-4 border-b border-white/10">
                <button
                  onClick={handleStartConversation}
                  className="w-full px-4 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>+</span>
                  <span>New Chat</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-white/40 text-sm">
                    No conversations yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`group relative rounded-lg transition-all ${
                          currentConversationId === conv.id
                            ? 'bg-primary/10 border border-primary/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {editingConversationId === conv.id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleRenameConversation(conv.id, editingTitle)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameConversation(conv.id, editingTitle);
                              }
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-primary rounded-lg text-white text-sm focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => loadConversation(conv.id)}
                            className="w-full text-left px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">💬</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-medium truncate">
                                  {conv.title}
                                </div>
                                <div className="text-xs text-white/40">
                                  {conv.message_count} messages
                                </div>
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Actions */}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingConversationId(conv.id);
                              setEditingTitle(conv.title);
                            }}
                            className="p-1 rounded hover:bg-white/10"
                            title="Rename"
                          >
                            <svg className="size-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conv.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 rounded hover:bg-red-500/10"
                            title="Delete"
                          >
                            <svg className="size-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 text-xs text-white/40 text-center">
                {conversations.length} / 5 conversations
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute left-4 top-20 z-10 p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            {showSidebar ? '◀' : '▶'}
          </button>

          {/* Configuration Panel */}
          <AnimatePresence>
            {showConfig && (
              <motion.div
                initial={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/10 bg-background-dark/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                      <span>🤖</span>
                      <span>AI Advisor</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                      Get personalized advice powered by cutting-edge open-source AI models. 
                      Choose your model and topic to begin.
                    </p>
                  </div>

                  {/* Model Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-white mb-4 text-center">
                      1️⃣ Choose Your AI Model
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                      {aiModels.map((model) => (
                        <motion.button
                          key={model.id}
                          onClick={() => setSelectedModel(model.id)}
                          className={`p-5 rounded-xl border transition-all text-left relative overflow-hidden ${
                            selectedModel === model.id
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {selectedModel === model.id && (
                            <div className="absolute top-3 right-3 size-6 rounded-full bg-primary flex items-center justify-center">
                              <svg className="size-4 text-background-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          
                          <div className="text-4xl mb-3">{model.icon}</div>
                          <div className="font-bold text-white text-base mb-1">{model.name}</div>
                          <div className="text-xs text-white/50 mb-2">{model.provider}</div>
                          <div className="text-xs text-white/70 mb-3">{model.description}</div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                              {model.speed}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Field Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-white mb-4 text-center">
                      2️⃣ Select Your Topic Area
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 max-w-6xl mx-auto">
                      {fields.map((field) => (
                        <motion.button
                          key={field.id}
                          onClick={() => setSelectedField(field.id)}
                          className={`p-4 rounded-xl border transition-all text-center ${
                            selectedField === field.id
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-3xl mb-2">{field.icon}</div>
                          <div className="text-xs font-bold text-white mb-1">{field.name}</div>
                          <div className="text-[10px] text-white/60">{field.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="text-center">
                    <motion.button
                      onClick={handleStartConversation}
                      className="px-10 py-4 rounded-xl bg-primary text-background-dark font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center gap-3">
                        <span>🚀</span>
                        <span>Start Conversation</span>
                      </span>
                    </motion.button>
                    <p className="text-xs text-white/50 mt-3">
                      Using {selectedModelData.name} for {selectedFieldData.name}
                    </p>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Bar (when config is hidden) */}
          {!showConfig && (
            <div className="border-b border-white/10 bg-background-dark/80 backdrop-blur-sm sticky top-16 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowConfig(true)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2"
                    >
                      <span>⚙️</span>
                      <span>Change Settings</span>
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm flex items-center gap-2">
                        <span>{selectedModelData.icon}</span>
                        <span>{selectedModelData.name}</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm flex items-center gap-2">
                        <span>{selectedFieldData.icon}</span>
                        <span>{selectedFieldData.name}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMessages([])}
                    className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2"
                    title="Clear conversation"
                  >
                    <span>🗑️</span>
                    <span className="hidden sm:inline">Clear Chat</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    <div className="text-7xl mb-6">💡</div>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">Ready to Help!</h2>
                  <p className="text-white/60 max-w-md mb-8 text-lg">
                    Ask me anything about {selectedFieldData.name.toLowerCase()}. 
                    I'm powered by <span className="text-primary font-medium">{selectedModelData.name}</span>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                    {[
                      "What should I focus on this week?",
                      "Help me create an action plan",
                      "Give me personalized advice",
                      "Analyze my current situation"
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
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                        {!message.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{selectedModelData.icon}</span>
                            <span className="text-xs text-white/60 font-medium">{selectedModelData.name}</span>
                          </div>
                        )}
                        <div className={`rounded-2xl px-6 py-4 ${
                          message.isUser 
                            ? 'bg-primary text-background-dark' 
                            : message.error
                            ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                            : 'bg-white/5 border border-white/10 text-white'
                        }`}>
                          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className={`text-xs text-white/40 mt-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    placeholder={`Ask about ${selectedFieldData.name.toLowerCase()}...`}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none text-base"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-8 py-4 rounded-xl bg-primary text-background-dark font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>Send</span>
                  <span>✨</span>
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-white/40">
                  Powered by {selectedModelData.name} • {selectedFieldData.name}
                </p>
                <p className="text-xs text-white/40">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Limit Modal */}
      <LimitModal 
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        conversations={conversations}
        onSelectDelete={(id) => {
          setConversationToDelete(id);
          setShowDeleteModal(true);
          setShowLimitModal(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConversationToDelete(null);
        }}
        onConfirm={() => handleDeleteConversation(conversationToDelete)}
      />
    </div>
  );
};

// Limit Modal Component
const LimitModal = ({ isOpen, onClose, conversations, onSelectDelete }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-5xl mb-4 text-center">⚠️</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">Conversation Limit Reached</h3>
                <p className="text-white/60 text-center mb-6">
                  You can only have 5 conversations saved. Please delete one to create a new conversation.
                </p>

                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{conv.title}</div>
                        <div className="text-xs text-white/40">{conv.message_count} messages</div>
                      </div>
                      <button
                        onClick={() => onSelectDelete(conv.id)}
                        className="ml-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-4xl mb-3 text-center">🗑️</div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">Delete Conversation?</h3>
                <p className="text-white/60 text-center text-sm mb-6">
                  This action cannot be undone. All messages in this conversation will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:opacity-90 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAdvisorPage;
