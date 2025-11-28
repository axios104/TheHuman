import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sectorAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const CreateSectorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    sector_type: 'HEALTH',
    description: '',
    color: '#0df2f2',
    icon: '💪'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sectorTypes = [
    { value: 'HEALTH', label: 'Health & Fitness', icon: '💪' },
    { value: 'FINANCE', label: 'Finance', icon: '💰' },
    { value: 'CAREER', label: 'Career', icon: '🚀' },
    { value: 'RELATIONSHIPS', label: 'Relationships', icon: '❤️' },
    { value: 'LEARNING', label: 'Learning', icon: '📚' },
    { value: 'CREATIVITY', label: 'Creativity', icon: '🎨' },
    { value: 'FITNESS', label: 'Fitness', icon: '🏃' },
    { value: 'MENTAL_HEALTH', label: 'Mental Health', icon: '🧘' },
  ];

  const colors = [
    '#0df2f2', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Sending sector data:', formData);

    try {
      const response = await sectorAPI.create(formData);
      console.log('Sector created successfully:', response.data);
      toast.success(`✨ ${formData.name} sector created!`, { duration: 2000 });
      onSuccess();
      onClose();
      setFormData({
        name: '',
        sector_type: 'HEALTH',
        description: '',
        color: '#0df2f2',
        icon: '💪'
      });
    } catch (err) {
      console.error('Error creating sector:', err.response?.data);
      const errorMessage = err.response?.data?.detail
        ? (Array.isArray(err.response.data.detail)
          ? err.response.data.detail.map(e => e.msg).join(', ')
          : err.response.data.detail)
        : 'Failed to create sector';
      setError(errorMessage);
      toast.error(`Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };


  const handleTypeChange = (type) => {
    const selectedType = sectorTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      sector_type: type,
      icon: selectedType?.icon || '📊'
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      sector_type: 'HEALTH',
      description: '',
      color: '#0df2f2',
      icon: '💪'
    });
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl max-h-[85vh] rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Header - Fixed */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 flex-shrink-0">
                <h2 className="text-xl font-bold text-white">Create New Sector</h2>
                <button
                  onClick={handleClose}
                  className="size-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <div className="font-medium mb-1">Error Creating Sector</div>
                        <div className="text-xs">{error}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sector Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sector Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Morning Routine, Budget Planning"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>

                {/* Sector Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sector Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {sectorTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeChange(type.value)}
                        className={`p-3 rounded-lg border transition-all ${formData.sector_type === type.value
                            ? 'border-primary bg-primary/10 text-white scale-105'
                            : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                          }`}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div className="text-xs font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What do you want to track in this sector?"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Color Theme
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`size-10 rounded-lg transition-all ${formData.color === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-background-dark scale-110'
                            : 'hover:scale-105'
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                  <div className="text-xs text-white/60 mb-2">Preview</div>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{formData.icon}</div>
                    <div>
                      <div className="font-bold text-white text-sm">{formData.name || 'Sector Name'}</div>
                      <div className="text-xs" style={{ color: formData.color }}>
                        {sectorTypes.find(t => t.value === formData.sector_type)?.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="flex gap-3 p-4 border-t border-white/10 bg-white/5 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || !formData.name.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        ircle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Sector'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateSectorModal;
