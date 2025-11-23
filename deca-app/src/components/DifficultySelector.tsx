import React from 'react';
import { motion } from 'framer-motion';

interface DifficultySelectorProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  setDifficulty,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 2.0 }}
      className="text-center space-y-4 xs:space-y-6"
    >
      <h3 className="text-lg xs:text-2xl font-bold">Choose Your Challenge Level</h3>
      <div className="flex justify-center">
        <div className="glass-panel p-1 xs:p-2 rounded-2xl border-2 border-white/10">
          <div className="flex gap-1 xs:gap-2">
            {(['Easy', 'Medium', 'Hard'] as const).map((d, index) => (
              <motion.button
                key={d}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                onClick={() => setDifficulty(d)}
                className={`btn px-4 xs:px-6 py-2 xs:py-3 rounded-xl font-semibold transition-all duration-300 text-sm xs:text-base touch-target ${
                  difficulty === d
                    ? 'btn-primary glow-primary shadow-xl'
                    : 'btn-ghost hover:bg-white/10 hover-lift'
                }`}
              >
                {d}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs xs:text-sm text-gray-400 max-w-md mx-auto px-2">
        {difficulty === 'Easy' && 'Perfect for beginners. Focus on building confidence and basic skills.'}
        {difficulty === 'Medium' && 'Balanced challenge. Test your knowledge with moderate complexity.'}
        {difficulty === 'Hard' && 'Expert level. Push your limits with advanced business scenarios.'}
      </p>
    </motion.div>
  );
};