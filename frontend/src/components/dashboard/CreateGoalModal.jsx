import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { goalAPI, sectorAPI } from '../../utils/api';

const CreateGoalModal = ({ isOpen, onClose, onSuccess, preselectedSectorId = null }) => {
  const [sectors, setSectors] = useState([]);
  const [formData, setFormData] = useState({
    sector_id: preselectedSectorId || '',
    title: '',
    description: '',
    target_value: '',
    unit: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSectors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedSectorId) {
      setFormData(prev => ({ ...prev, sector_id: preselectedSectorId }));
    }
  }, [preselectedSectorId]);

  const fetchSectors = async () => {
    try {
      const response = await sectorAPI.getAll();
      setSectors(response.data);
      if (!preselectedSectorId && response.data.length > 0) {
        setFormData(prev => ({ ...prev, sector_id: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const goalData = {
        title: formData.title,
        description: formData.description || null,
        target_value: formData.target_value ? parseFloat(formData.target_value) : null,
        unit: formData.unit || null,
        deadline: formData.deadline || null
      };

      await goalAPI.create(formData.sector_id, goalData);
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error creating goal:', err.response?.data);
      setError(err.response?.data?.detail || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      sector_id: preselectedSectorId || '',
      title: '',
      description: '',
      target_value: '',
      unit: '',
      deadline: ''
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
              className="w-full max-w-md max-h-[85vh] rounded-2xl border border-white/10 bg-background-dark shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header - Fixed */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 flex-shrink-0">
                <h2 className="text-xl font-bold text-white">Create New Goal</h2>
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
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Sector Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Sector <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.sector_id}
                    onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                  >
                    <option value="">Select a sector</option>
                    {sectors.map(sector => (
                      <option key={sector.id} value={sector.id}>
                        {sector.icon} {sector.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Goal Title */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Goal Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Run 5km daily, Save $10,000"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add more details..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                  />
                </div>

                {/* Target Value & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Target
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.target_value}
                      onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                      placeholder="100"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="km, $"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </form>

              {/* Footer - Fixed */}
              <div className="flex gap-3 p-4 border-t border-white/10 bg-white/5 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:opacity-90 transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateGoalModal;
