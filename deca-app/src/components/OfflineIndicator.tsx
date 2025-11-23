import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOffline } from '../hooks/useOffline';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useOffline();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          role="alert"
          aria-live="assertive"
        >
          <div className="glass-panel rounded-2xl p-4 border-red-500/30 bg-red-500/10 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <WifiOff size={20} className="text-red-400" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-red-200">You're offline</p>
                <p className="text-xs text-red-300">Some features may be limited</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          role="status"
          aria-live="polite"
        >
          <div className="glass-panel rounded-2xl p-4 border-green-500/30 bg-green-500/10 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Wifi size={20} className="text-green-400" />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-green-200">Back online!</p>
                <p className="text-xs text-green-300">Connection restored</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for checking if features require online connectivity
export const useOnlineRequired = () => {
  const { isOnline } = useOffline();

  const requireOnline = (feature: string, callback: () => void) => {
    if (!isOnline) {
      // Could show a modal or toast here
      console.warn(`${feature} requires an internet connection`);
      return false;
    }
    callback();
    return true;
  };

  return { isOnline, requireOnline };
};