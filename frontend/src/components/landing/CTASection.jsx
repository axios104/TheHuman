import React from 'react';
import { motion } from 'framer-motion';

const CTASection = ({ onGetStarted }) => {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          className="text-6xl font-cyber mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          READY TO <span className="text-neon-purple glow-text-purple">EVOLVE</span>?
        </motion.h2>
        
        <motion.p 
          className="font-mono text-xl text-gray-400 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join the future of personal growth. Your AI mentor awaits.
        </motion.p>

        <motion.button
          onClick={onGetStarted}
          className="cyber-button-large px-12 py-6 font-cyber text-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.1 }}
        >
          START YOUR JOURNEY
        </motion.button>
      </div>

      {/* Background grid effect */}
      <div className="absolute inset-0 grid-background opacity-10"></div>
    </section>
  );
};

export default CTASection;
