import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      className="glass-card p-8 rounded-2xl border border-white/10 backdrop-blur-xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
