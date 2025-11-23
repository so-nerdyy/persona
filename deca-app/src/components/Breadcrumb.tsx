import React from 'react';
import { ChevronRight, Home, BookOpen, MessageSquare, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                size={16}
                className="text-gray-400 mx-2 flex-shrink-0"
                aria-hidden="true"
              />
            )}

            {item.href && !item.current ? (
              <motion.a
                href={item.href}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 focus-visible-enhanced"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.a>
            ) : (
              <span
                className={`flex items-center gap-2 ${
                  item.current
                    ? 'text-white font-medium'
                    : 'text-gray-400'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Hook to generate breadcrumbs based on app state
export const useBreadcrumbs = (gameState: string) => {
  const baseItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '#',
      icon: <Home size={16} />,
      current: gameState === 'IDLE'
    }
  ];

  switch (gameState) {
    case 'GENERATING':
      return [
        ...baseItems,
        {
          label: 'Generating Scenario',
          icon: <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" aria-hidden="true" />,
          current: true
        }
      ];

    case 'PREPARING':
      return [
        ...baseItems,
        {
          label: 'Preparation Phase',
          icon: <BookOpen size={16} />,
          current: true
        }
      ];

    case 'PLAYING':
      return [
        ...baseItems,
        {
          label: 'Roleplay Session',
          icon: <MessageSquare size={16} />,
          current: true
        }
      ];

    case 'GRADING':
      return [
        ...baseItems,
        {
          label: 'Evaluating Performance',
          icon: <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" aria-hidden="true" />,
          current: true
        }
      ];

    case 'FINISHED':
      return [
        ...baseItems,
        {
          label: 'Feedback & Results',
          icon: <Trophy size={16} />,
          current: true
        }
      ];

    default:
      return baseItems;
  }
};