import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { goalAPI, sectorAPI } from '../../utils/api';
import toast from 'react-hot-toast';

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
  const [loadingSectors, setLoadingSectors] = useState(true);
  const [error, setError] = useState('');

  // Default 5 sectors
  const defaultSectors = [
    { id: 'default-1', name: 'Health & Fitness', icon: '💪', color: '#10b981', isDefault: true },
    { id: 'default-2', name: 'Finance & Money', icon: '💰', color: '#f59e0b', isDefault: true },
    { id: 'default-3', name: 'Career & Work', icon: '🚀', color: '#8b5cf6', isDefault: true },
    { id: 'default-4', name: 'Learning & Skills', icon: '📚', color: '#06b6d4', isDefault: true },
    { id: 'default-5', name: 'Mental Wellness', icon: '🧘', color: '#ec4899', isDefault: true }
  ];


// Update handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.sector_id) {
    setError('Please select a sector');
    toast.error('Please select a sector');
    return;
  }

  const selectedSector = sectors.find(s => s.id === formData.sector_id);
  if (selectedSector?.isDefault) {
    const errorMsg = 'Please create this sector first before adding goals to it.';
    setError(errorMsg);
    toast.error(errorMsg);
    return;
  }
  
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

    console.log('Creating goal for sector:', formData.sector_id);
    await goalAPI.create(formData.sector_id, goalData);
    toast.success(`🎯 Goal "${formData.title}" created!`, { duration: 2000 });
    onSuccess();
    handleClose();
  } catch (err) {
    console.error('Error creating goal:', err.response?.data);
    const errorMsg = err.response?.data?.detail || 'Failed to create goal';
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (isOpen) {
      fetchSectors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedSectorId && sectors.length > 0) {
      setFormData(prev => ({ ...prev, sector_id: preselectedSectorId }));
    }
  }, [preselectedSectorId, sectors]);

  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await sectorAPI.getAll();
      console.log('Fetched sectors:', response.data);
      
      // Merge user sectors with default sectors
      const userSectors = response.data || [];
      const allSectors = [...userSectors, ...defaultSectors];
      
      setSectors(allSectors);
      
      // Set first sector as default if no preselected
      if (!preselectedSectorId && allSectors.length > 0) {
        setFormData(prev => ({ ...prev, sector_id: allSectors[0].id }));
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
      // Even on error, show default sectors
      setSectors(defaultSectors);
      if (!preselectedSectorId) {
        setFormData(prev => ({ ...prev, sector_id: defaultSectors[0].id }));
      }
    } finally {
      setLoadingSectors(false);
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
                  {loadingSectors ? (
                    <div className="text-white/60 text-sm">Loading sectors...</div>
                  ) : (
                    <>
                      <select
                        required
                        value={formData.sector_id}
                        onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                      >
                        <option value="">Select a sector</option>
                        
                        {/* User's Created Sectors */}
                        {sectors.filter(s => !s.isDefault).length > 0 && (
                          <optgroup label="Your Sectors" className="bg-background-dark">
                            {sectors.filter(s => !s.isDefault).map(sector => (
                              <option key={sector.id} value={sector.id} className="bg-background-dark">
                                {sector.icon} {sector.name}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        {/* Default Sectors (Not Created Yet) */}
                        <optgroup label="Available Sectors (Create these first)" className="bg-background-dark">
                          {sectors.filter(s => s.isDefault).map(sector => (
                            <option key={sector.id} value={sector.id} className="bg-background-dark text-white/60">
                              {sector.icon} {sector.name} (Not created)
                            </option>
                          ))}
                        </optgroup>
                      </select>

                      {/* Helper Text */}
                      <p className="text-xs text-white/40 mt-2">
                        💡 Tip: Create sectors first from the Sectors page, then add goals to them
                      </p>
                    </>
                  )}
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
                  disabled={loading || loadingSectors}
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
