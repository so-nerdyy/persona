import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioSelectorProps {
  mode: 'random' | 'guided';
  setMode: (mode: 'random' | 'guided') => void;
  topic: string;
  setTopic: (topic: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  mode,
  setMode,
  topic,
  setTopic,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 2.2 }}
      className="text-center space-y-4 xs:space-y-6"
    >
      <h3 className="text-lg xs:text-2xl font-bold">Choose Scenario Mode</h3>
      <div className="flex justify-center">
        <div className="glass-panel p-1 xs:p-2 rounded-2xl border-2 border-white/10">
          <div className="flex gap-1 xs:gap-2">
            {(['random', 'guided'] as const).map((m, index) => (
              <motion.button
                key={m}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 2.4 + index * 0.1 }}
                onClick={() => setMode(m)}
                className={`btn px-4 xs:px-6 py-2 xs:py-3 rounded-xl font-semibold transition-all duration-300 text-sm xs:text-base touch-target ${
                  mode === m
                    ? 'btn-primary glow-primary shadow-xl'
                    : 'btn-ghost hover:bg-white/10 hover-lift'
                }`}
              >
                {m === 'random' ? 'Random' : 'Guided'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs xs:text-sm text-gray-400 max-w-md mx-auto px-2">
        {mode === 'random' && 'AI will generate a completely random scenario for you.'}
        {mode === 'guided' && 'Specify a topic or situation you want to practice.'}
      </p>

      {/* Topic Input for Guided Mode */}
      <AnimatePresence>
        {mode === 'guided' && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <div className="glass-panel p-4 xs:p-6 rounded-2xl border-white/10">
              <label htmlFor="topic" className="block text-sm font-semibold text-gray-300 mb-3">
                Enter Your Topic or Situation
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='e.g., "social media campaign", "pricing strategy", "customer complaint"'
                className="w-full px-4 xs:px-5 py-3 xs:py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm xs:text-base"
              />
              <p className="text-xs text-gray-500 mt-2">
                The AI will create a scenario focused on your specified topic
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};