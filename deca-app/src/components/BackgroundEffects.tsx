import React from 'react';

const BackgroundEffects: React.FC = () => {
  // Generate random particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2, // 2-6px
    x: Math.random() * 100, // 0-100%
    y: Math.random() * 100,
    delay: Math.random() * 10, // 0-10s delay
    duration: Math.random() * 20 + 10, // 10-30s duration
    opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 opacity
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Existing gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-cyan-500/5 rounded-full blur-[120px] animate-float" />

      {/* Additional animated gradient orbs */}
      <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] bg-gradient-to-br from-pink-500/8 to-orange-500/8 rounded-full blur-[100px] animate-float delay-2000" />
      <div className="absolute bottom-[30%] left-[10%] w-[35%] h-[35%] bg-gradient-to-tr from-green-500/6 to-blue-500/6 rounded-full blur-[80px] animate-float delay-3000" />
      <div className="absolute top-[60%] right-[5%] w-[25%] h-[25%] bg-gradient-to-bl from-purple-500/7 to-cyan-500/7 rounded-full blur-[60px] animate-float delay-500" />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-particle-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/1 to-transparent animate-gradient-shift" />

      {/* Radial gradient sweep */}
      <div className="absolute inset-0 bg-gradient-conic from-transparent via-white/2 to-transparent animate-rotate-slow opacity-30" />
    </div>
  );
};

export default BackgroundEffects;