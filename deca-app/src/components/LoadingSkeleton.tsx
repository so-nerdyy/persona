import React from 'react';
import { useReducedMotion } from '../hooks/useAnimation';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'card' | 'text' | 'avatar' | 'button';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  lines = 1,
  variant = 'text',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const baseClasses = prefersReducedMotion
    ? 'bg-gray-700/50 rounded'
    : 'animate-shimmer bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 rounded';

  const variantClasses = {
    card: 'glass-card p-6 space-y-4',
    text: 'h-4',
    avatar: 'w-12 h-12 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${variantClasses.card} ${className}`}>
        <div className="flex items-center space-x-4">
          <div className={`${baseClasses} ${variantClasses.avatar}`} />
          <div className="space-y-2 flex-1">
            <div className={`${baseClasses} h-4 w-3/4`} />
            <div className={`${baseClasses} h-3 w-1/2`} />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className={`${baseClasses} h-3 w-full`} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text} w-full`}
            style={{ animationDelay: prefersReducedMotion ? '0ms' : `${i * 0.2}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

// Specialized skeleton components
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="card" className={className} />
);

export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ lines, className }) => (
  <LoadingSkeleton variant="text" lines={lines} className={className} />
);

export const AvatarSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="avatar" className={className} />
);

export const ButtonSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="button" className={className} />
);