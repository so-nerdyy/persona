import React from 'react';
import { motion } from 'framer-motion';

export const InstructionsStepper: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative z-10 max-w-6xl mx-auto px-4 xs:px-6"
    >
      <div className="text-center mb-8 xs:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2 xs:mb-4 px-2"
        >
          How to <span className="text-gradient-primary">Master</span> Your Skills
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-sm xs:text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-2"
        >
          Follow these simple steps to transform your DECA performance with AI-powered training
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="card glass-card hover-lift group"
        >
          <div className="text-center space-y-4 xs:space-y-6 p-4 xs:p-6">
            <div className="relative mx-auto w-16 h-16 xs:w-20 xs:h-20">
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl xs:text-3xl font-black text-white">1</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg xs:text-xl font-bold mb-2 xs:mb-3 text-gradient">Choose Your Event</h3>
              <p className="text-gray-400 leading-relaxed text-sm xs:text-base">
                Select from a comprehensive library of DECA event categories tailored to your competition focus and skill level.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-1 xs:w-12 xs:h-1 bg-gradient-primary rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="card glass-card hover-lift group"
        >
          <div className="text-center space-y-4 xs:space-y-6 p-4 xs:p-6">
            <div className="relative mx-auto w-16 h-16 xs:w-20 xs:h-20">
              <div className="absolute inset-0 bg-gradient-secondary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl xs:text-3xl font-black text-white">2</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg xs:text-xl font-bold mb-2 xs:mb-3 text-gradient">Prepare & Practice</h3>
              <p className="text-gray-400 leading-relaxed text-sm xs:text-base">
                Immerse yourself in realistic scenarios, take strategic notes, and refine your presentation skills in a safe environment.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-1 xs:w-12 xs:h-1 bg-gradient-secondary rounded-full"></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="card glass-card hover-lift group"
        >
          <div className="text-center space-y-4 xs:space-y-6 p-4 xs:p-6">
            <div className="relative mx-auto w-16 h-16 xs:w-20 xs:h-20">
              <div className="absolute inset-0 bg-gradient-accent rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-full h-full bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl xs:text-3xl font-black text-white">3</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg xs:text-xl font-bold mb-2 xs:mb-3 text-gradient">Get Expert Feedback</h3>
              <p className="text-gray-400 leading-relaxed text-sm xs:text-base">
                Receive instant, detailed AI-powered analysis on DECA KPIs, communication skills, and strategic thinking.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-1 xs:w-12 xs:h-1 bg-gradient-accent rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};