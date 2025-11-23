import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BackgroundEffects from './BackgroundEffects';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4 sm:p-6 relative overflow-hidden">
      <BackgroundEffects />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-blue-500/30 hover-scale">
            <span className="font-black text-2xl sm:text-3xl italic">P</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-2 sm:mb-3">
            <span className="text-gradient-primary">Persona</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 font-medium">AI DECA Roleplay Assistant</p>
        </motion.div>

        {/* Login/Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border-white/10 shadow-2xl"
        >
          {/* Toggle between Login and Register */}
          <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 p-1.5 sm:p-2 glass-panel rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                !isRegister
                  ? 'bg-gradient-primary text-white glow-primary shadow-xl'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn size={16} className="inline mr-2" />
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                isRegister
                  ? 'bg-gradient-primary text-white glow-primary shadow-xl'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus size={16} className="inline mr-2" />
              Register
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 sm:gap-3 text-red-300 text-sm sm:text-base"
              >
                <AlertCircle size={18} className="sm:w-5 sm:h-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">
                <User size={16} className="inline mr-2" />
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base sm:text-lg"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-gray-300 mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-base sm:text-lg"
                placeholder="Enter your password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              {isRegister && (
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  Password must be at least 4 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 sm:py-4 bg-gradient-primary text-white font-bold rounded-xl glow-primary shadow-2xl hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  {isRegister ? 'Creating Account...' : 'Logging In...'}
                </span>
              ) : (
                <span>
                  {isRegister ? (
                    <>
                      <UserPlus size={18} className="inline mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="inline mr-2" />
                      Login to Persona
                    </>
                  )}
                </span>
              )}
            </motion.button>
          </form>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400"
          >
            {isRegister ? (
              'Create an account to save your roleplay history'
            ) : (
              'Login to access your personalized DECA practice'
            )}
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500"
        >
          Powered by OpenAI GPT-4o
        </motion.div>
      </motion.div>
    </div>
  );
};

