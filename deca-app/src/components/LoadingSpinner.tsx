import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  color?: 'blue' | 'purple' | 'green';
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  color = 'blue',
  title,
  subtitle,
  size = 'lg'
}) => {
  const colorClasses = {
    blue: {
      primary: 'text-blue-500',
      glow: 'bg-blue-500/20',
      particles: 'bg-blue-400/60'
    },
    purple: {
      primary: 'text-purple-500',
      glow: 'bg-purple-500/20',
      particles: 'bg-purple-400/60'
    },
    green: {
      primary: 'text-green-500',
      glow: 'bg-green-500/20',
      particles: 'bg-green-400/60'
    }
  };

  const sizeClasses = {
    sm: { container: 'w-12 h-12', icon: 24 },
    md: { container: 'w-16 h-16', icon: 32 },
    lg: { container: 'w-20 h-20', icon: 48 }
  };

  const currentColor = colorClasses[color];
  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 xs:space-y-8 px-4">
      {/* Main Spinner Container */}
      <div className="relative">
        {/* Pulsing Background Glow */}
        <motion.div
          className={`absolute inset-0 ${currentColor.glow} blur-2xl rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Outer Ring */}
        <motion.div
          className={`absolute inset-0 border-2 ${currentColor.primary} border-opacity-20 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-2 border border-${color}-400 border-opacity-40 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Orbiting Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 ${currentColor.particles} rounded-full`}
            style={{
              top: '50%',
              left: '50%',
              marginLeft: '-4px',
              marginTop: '-4px'
            }}
            animate={{
              rotate: [0, 360],
              x: [0, Math.cos((i * 60 * Math.PI) / 180) * 40],
              y: [0, Math.sin((i * 60 * Math.PI) / 180) * 40]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1
            }}
          />
        ))}

        {/* Central Icon */}
        <motion.div
          className={`${currentSize.container} flex items-center justify-center relative z-10`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Loader2
            size={currentSize.icon}
            className={`${currentColor.primary} animate-spin`}
          />
        </motion.div>
      </div>

      {/* Text Content */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          className="text-2xl font-bold text-white"
          animate={{
            textShadow: [
              '0 0 0px rgba(255,255,255,0)',
              '0 0 10px rgba(255,255,255,0.5)',
              '0 0 0px rgba(255,255,255,0)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {title}
        </motion.p>
        {subtitle && (
          <motion.p
            className="text-gray-400"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;