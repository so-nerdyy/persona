import React, { useState } from 'react';
import { EventSelector } from './EventSelector';
import { Settings, Play, Mic, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  onStartScenario: (event: string, difficulty: 'Easy' | 'Medium' | 'Hard', options?: { topic?: string; mode?: string }) => void;
}

export const Home: React.FC<HomeProps> = ({ difficulty, setDifficulty, onStartScenario }) => {
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
   const [voiceSpeed, setVoiceSpeed] = useState(1.0);
   const [mode, setMode] = useState<'random' | 'guided'>('random');
   const [topic, setTopic] = useState('');

  const handleSaveSettings = () => {
    // For voice speed, we could store in localStorage and modify speech service
    localStorage.setItem('voiceSpeed', voiceSpeed.toString());
    setIsSettingsOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Menu Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full glass border-b border-white/10 py-4 px-6 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="font-black text-xl italic">P</span>
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight leading-none">Persona</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">AI Roleplay Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="btn btn-ghost hover-lift"
        >
          <Settings size={16} />
          Settings
        </button>
      </motion.div>

      {/* Hero Section */}
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

      {/* Instructions */}
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

      {/* Features & Stats */}
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

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="relative z-10 flex flex-col items-center space-y-8 xs:space-y-12 px-4 xs:px-6 pb-12 xs:pb-20"
      >
        {/* Difficulty Selector */}
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

        {/* Scenario Mode Selector */}
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
      </motion.div>

      {/* Event Selector */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        className="relative z-10 px-4 xs:px-6 pb-16 xs:pb-32"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
            className="text-center mb-6 xs:mb-8"
          >
            <h3 className="text-lg xs:text-2xl font-bold mb-2">Select Your DECA Event</h3>
            <p className="text-gray-400 text-sm xs:text-base">Choose from our comprehensive library of competition scenarios</p>
          </motion.div>
          <EventSelector onSelect={(event) => onStartScenario(event, difficulty, { topic, mode })} disabled={false} />
        </div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-modal max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Settings size={20} className="text-white" />
                  </div>
                  Settings
                </h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="btn btn-ghost p-2 hover-lift"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Voice Speed */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold flex items-center gap-2">
                    <Mic size={16} className="text-blue-400" />
                    Voice Speed
                  </label>
                  <div className="glass-card p-4">
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>0.5x</span>
                      <span className="font-semibold text-white">{voiceSpeed}x</span>
                      <span>2x</span>
                    </div>
                  </div>
                </div>

                {/* Difficulty Preference */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold">Default Difficulty</label>
                  <div className="glass-card p-2">
                    <div className="grid grid-cols-3 gap-2">
                      {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`btn py-3 px-4 rounded-lg font-medium transition-all ${
                            difficulty === d
                              ? 'btn-primary glow-primary'
                              : 'btn-ghost hover:bg-white/10'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSettings}
                className="btn btn-primary btn-lg w-full mt-8"
              >
                <Save size={16} />
                Save Settings
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};