import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../utils/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import DashboardNav from '../components/dashboard/DashboardNav';

const NewsFeedPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  const categories = [
    { id: 'general', name: 'All News', icon: '📰', query: 'general' },
    { id: 'health', name: 'Health', icon: '💪', query: 'health fitness wellness' },
    { id: 'business', name: 'Business', icon: '💰', query: 'business finance economy' },
    { id: 'technology', name: 'Technology', icon: '💻', query: 'technology AI innovation' },
    { id: 'science', name: 'Science', icon: '🔬', query: 'science research' },
    { id: 'sports', name: 'Sports', icon: '⚽', query: 'sports' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', query: 'entertainment movies' },
    { id: 'world', name: 'World', icon: '🌍', query: 'world international' },
  ];

  useEffect(() => {
    fetchUserData();
    fetchSavedNews();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchNews();
    }
  }, [selectedCategory]);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/saved-news', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedNews(response.data);
    } catch (error) {
      console.error('Error fetching saved news:', error);
    }
  };

  const fetchNews = async () => {
    setNewsLoading(true);
    
    try {
      const selectedCat = categories.find(c => c.id === selectedCategory);
      const query = selectedCat?.query || 'general';
      
      const response = await axios.get('https://gnews.io/api/v4/search', {
        params: {
          q: query,
          lang: 'en',
          country: 'us',
          max: 20,
          apikey: import.meta.env.VITE_GNEWS_API_KEY
        }
      });

      console.log('✅ News fetched:', response.data.articles.length);
      setNews(response.data.articles || []);
      
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      toast.error('Failed to load news');
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleSaveNews = async (article) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if already saved
      const savedArticle = savedNews.find(saved => saved.url === article.url);
      
      if (savedArticle) {
        // UNSAVE - Delete it
        await axios.delete(`http://localhost:8000/api/saved-news/${savedArticle.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('🗑️ Removed from saved');
        fetchSavedNews();
        return;
      }

      // SAVE - Add it
      const newsData = {
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        source: article.source.name,
        published_at: article.publishedAt,
        category: selectedCategory
      };

      await axios.post('http://localhost:8000/api/saved-news', newsData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('💾 News saved!');
      fetchSavedNews();
      
    } catch (error) {
      console.error('Error toggling save news:', error);
      toast.error('Failed to update');
    }
  };

  const handleDeleteSaved = async (newsId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/saved-news/${newsId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Removed from saved');
      fetchSavedNews();
      
    } catch (error) {
      console.error('Error deleting saved news:', error);
      toast.error('Failed to remove');
    }
  };

  const isNewsSaved = (url) => {
    return savedNews.some(saved => saved.url === url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <span>📰</span>
                  <span>News Feed</span>
                </h1>
                <p className="text-white/60">Real-time news from around the world</p>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaved(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    !showSaved
                      ? 'bg-primary text-background-dark'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  Latest News
                </button>
                <button
                  onClick={() => setShowSaved(true)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    showSaved
                      ? 'bg-primary text-background-dark'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span>💾</span>
                  <span>Saved ({savedNews.length})</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category Filter - Only show when not viewing saved */}
          {!showSaved && (
            <div className="mb-8">
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary/10 text-primary border-2 border-primary/30 scale-105'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News Grid */}
          {newsLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-white/60">Loading news...</p>
            </div>
          ) : showSaved ? (
            // Saved News View
            savedNews.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💾</div>
                <p className="text-white/60 text-lg mb-4">No saved news yet</p>
                <p className="text-white/40 text-sm mb-6">Click the bookmark icon on any article to save it</p>
                <button
                  onClick={() => setShowSaved(false)}
                  className="px-6 py-3 rounded-xl bg-primary text-background-dark font-bold hover:opacity-90 transition-all"
                >
                  Browse News
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedNews.map((article, idx) => (
                  <NewsCard
                    key={article.id}
                    article={{
                      title: article.title,
                      description: article.description,
                      url: article.url,
                      image: article.image,
                      source: { name: article.source },
                      publishedAt: article.published_at
                    }}
                    idx={idx}
                    onSave={null}
                    onDelete={() => handleDeleteSaved(article.id)}
                    isSaved={true}
                  />
                ))}
              </div>
            )
          ) : (
            // Latest News View
            news.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-white/60 text-lg mb-2">No news available</p>
                <p className="text-white/40 text-sm">Try selecting a different category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, idx) => (
                  <NewsCard
                    key={idx}
                    article={article}
                    idx={idx}
                    onSave={handleSaveNews}
                    onDelete={null}
                    isSaved={isNewsSaved(article.url)}
                  />
                ))}
              </div>
            )
          )}

          {/* Refresh Button */}
          {!showSaved && !newsLoading && news.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={fetchNews}
                className="px-8 py-4 rounded-xl bg-primary/10 border border-primary/30 text-primary font-bold hover:bg-primary/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>🔄</span>
                  <span>Refresh News</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// News Card Component
const NewsCard = ({ article, idx, onSave, onDelete, isSaved }) => {
  return (
    <motion.article
      className="group rounded-xl border border-white/10 bg-black/20 overflow-hidden hover:border-primary/30 transition-all flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-white/5">
        {article.image ? (
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📰
          </div>
        )}
        
        {/* Save/Unsave Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete && isSaved) {
              // In saved view, use onDelete
              onDelete();
            } else if (onSave) {
              // In news view, toggle save/unsave
              onSave(article);
            }
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 ${
            isSaved
              ? 'bg-primary/90 text-background-dark hover:bg-primary shadow-lg'
              : 'bg-black/60 text-white hover:bg-black/80'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save article'}
        >
          {isSaved ? (
            // Filled bookmark (saved)
            <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
            </svg>
          ) : (
            // Outline bookmark (not saved)
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-white/60 mb-4 line-clamp-3 flex-1">
          {article.description || 'No description available'}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-white/50 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">{article.source?.name || 'Unknown'}</span>
          </div>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>

        {/* Read More */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Read Full Article</span>
          <span>→</span>
        </a>
      </div>
    </motion.article>
  );
};

export default NewsFeedPage;
