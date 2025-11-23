import React from 'react';
import { motion } from 'framer-motion';

export const FeatureGrid: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative z-10 max-w-6xl mx-auto px-4 xs:px-6 py-8 xs:py-16"
    >
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 mb-8 xs:mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <div className="glass-card p-4 xs:p-6 hover-lift">
            <div className="text-2xl xs:text-3xl font-black text-gradient-primary mb-1 xs:mb-2">500+</div>
            <div className="text-xs xs:text-sm text-gray-400 font-medium">Practice Scenarios</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center"
        >
          <div className="glass-card p-4 xs:p-6 hover-lift">
            <div className="text-2xl xs:text-3xl font-black text-gradient-secondary mb-1 xs:mb-2">AI-Powered</div>
            <div className="text-xs xs:text-sm text-gray-400 font-medium">Smart Grading</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center"
        >
          <div className="glass-card p-4 xs:p-6 hover-lift">
            <div className="text-2xl xs:text-3xl font-black text-gradient-accent mb-1 xs:mb-2">Real-time</div>
            <div className="text-xs xs:text-sm text-gray-400 font-medium">Voice Analysis</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-center"
        >
          <div className="glass-card p-4 xs:p-6 hover-lift">
            <div className="text-2xl xs:text-3xl font-black text-gradient mb-1 xs:mb-2">24/7</div>
            <div className="text-xs xs:text-sm text-gray-400 font-medium">Available</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="text-center"
      >
        <h3 className="text-xl xs:text-2xl md:text-3xl font-bold mb-4 xs:mb-8 px-2">
          Why Choose <span className="text-gradient-primary">Persona</span>?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-8">
          <div className="glass-card p-4 xs:p-6 text-center hover-lift touch-target">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <span className="text-white font-bold text-lg xs:text-xl">🎯</span>
            </div>
            <h4 className="font-semibold mb-2 text-sm xs:text-base">Targeted Practice</h4>
            <p className="text-xs xs:text-sm text-gray-400">Focus on specific DECA events and skills with customized scenarios</p>
          </div>

          <div className="glass-card p-4 xs:p-6 text-center hover-lift touch-target">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <span className="text-white font-bold text-lg xs:text-xl">🧠</span>
            </div>
            <h4 className="font-semibold mb-2 text-sm xs:text-base">AI Intelligence</h4>
            <p className="text-xs xs:text-sm text-gray-400">Advanced AI provides detailed feedback and performance analysis</p>
          </div>

          <div className="glass-card p-4 xs:p-6 text-center hover-lift touch-target">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
              <span className="text-white font-bold text-lg xs:text-xl">⚡</span>
            </div>
            <h4 className="font-semibold mb-2 text-sm xs:text-base">Instant Results</h4>
            <p className="text-xs xs:text-sm text-gray-400">Get immediate scoring and suggestions to improve your performance</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};