import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 text-center space-y-6 xs:space-y-8 max-w-5xl mx-auto px-4 xs:px-6 pt-12 xs:pt-16 pb-12 xs:pb-20"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center gap-2 xs:gap-3 px-4 xs:px-6 py-2 xs:py-3 rounded-full glass-panel glow-primary text-blue-400 text-xs xs:text-sm font-semibold hover-scale touch-target"
      >
        <Play size={16} className="animate-pulse" />
        <span>Powered by OpenAI</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none mb-2 xs:mb-4">
          <span className="text-gradient block">Welcome to</span>
          <span className="text-gradient-primary block mt-1 xs:mt-2">Persona</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light px-2"
      >
        Master your DECA roleplay skills with AI-powered scenarios. Practice, get graded, and improve your business presentation abilities with cutting-edge technology.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-wrap justify-center gap-2 xs:gap-4 mt-6 xs:mt-8 px-2"
      >
        <div className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs xs:text-sm font-medium touch-target">
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-green-400 rounded-full animate-pulse"></div>
          AI-Powered Grading
        </div>
        <div className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs xs:text-sm font-medium touch-target">
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          Real-time Feedback
        </div>
        <div className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs xs:text-sm font-medium touch-target">
          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          Voice Recognition
        </div>
      </motion.div>
    </motion.div>
  );
};