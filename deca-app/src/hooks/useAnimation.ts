import { useEffect, useState } from 'react';

// Check for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Performance-optimized animation variants using tween easing
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }
};

// Hook for hover animations
export const useHoverAnimation = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    whileHover: prefersReducedMotion ? {} : { scale: 1.02 },
    whileTap: prefersReducedMotion ? {} : { scale: 0.98 }
  };
};

// Hook for focus animations
export const useFocusAnimation = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    whileFocus: prefersReducedMotion ? {} : { scale: 1.01 }
  };
};

// Hook for entrance animations with stagger
export const useStaggeredEntrance = (delay: number = 0) => {
  const prefersReducedMotion = useReducedMotion();

  return {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay: prefersReducedMotion ? 0 : delay
    }
  };
};

// Hook for loading animations
export const useLoadingAnimation = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    animate: prefersReducedMotion ? {} : { rotate: 360 },
    transition: {
      duration: 1,
      repeat: prefersReducedMotion ? 0 : Infinity,
      ease: 'linear'
    }
  };
};

// Hook for pulse animations
export const usePulseAnimation = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    animate: prefersReducedMotion ? {} : {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1]
    },
    transition: {
      duration: 2,
      repeat: prefersReducedMotion ? 0 : Infinity,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  };
};

// Hook for transition animations between states
export const useTransitionAnimation = (isVisible: boolean) => {
  const prefersReducedMotion = useReducedMotion();

  return {
    initial: false,
    animate: prefersReducedMotion ? {} : {
      opacity: isVisible ? 1 : 0,
      y: isVisible ? 0 : 10,
      scale: isVisible ? 1 : 0.95
    },
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  };
};