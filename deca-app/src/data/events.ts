import {
  Briefcase,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Building2,
  Calculator,
  Car,
  Shirt,
  Coffee,
  UtensilsCrossed,
  Home,
  Target,
  Phone,
  Gamepad2,
  Plane,
  BookOpen,
  Lightbulb,
  BarChart3,
  Scale
} from 'lucide-react';

export interface Event {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  category: string;
  icon: any;
  color: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const categories = [
  { id: 'all', name: 'All Events', icon: Briefcase },
  { id: 'team-decision', name: 'Team Decision Making', icon: Users },
  { id: 'marketing', name: 'Marketing & Sales', icon: TrendingUp },
  { id: 'finance', name: 'Finance & Accounting', icon: DollarSign },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: Lightbulb },
  { id: 'management', name: 'Business Management', icon: Briefcase },
  { id: 'hospitality', name: 'Hospitality & Tourism', icon: Plane },
  { id: 'food-retail', name: 'Food & Retail', icon: ShoppingBag },
  { id: 'principles', name: 'Principles', icon: BookOpen }
];

export const events: Event[] = [
  // Team Decision Making Events
  {
    id: 'bltdm',
    name: 'Business Law and Ethics Team Decision Making',
    shortName: 'Business Law & Ethics TDM',
    abbreviation: 'BLTDM',
    category: 'team-decision',
    icon: Scale,
    color: 'from-indigo-500 to-purple-600',
    description: 'Legal compliance, ethical decision-making, and case analysis in team settings.',
    skills: ['Legal Research', 'Ethical Analysis', 'Team Collaboration', 'Case Studies'],
    difficulty: 'Advanced'
  },
  {
    id: 'btdm',
    name: 'Buying and Merchandising Team Decision Making',
    shortName: 'Buying & Merchandising TDM',
    abbreviation: 'BTDM',
    category: 'team-decision',
    icon: ShoppingBag,
    color: 'from-pink-500 to-rose-600',
    description: 'Product selection, inventory management, and merchandising strategies as a team.',
    skills: ['Inventory Planning', 'Product Selection', 'Market Analysis', 'Team Strategy'],
    difficulty: 'Intermediate'
  },
  {
    id: 'etdm',
    name: 'Entrepreneurship Team Decision Making',
    shortName: 'Entrepreneurship TDM',
    abbreviation: 'ETDM',
    category: 'team-decision',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-600',
    description: 'Startup planning, business model development, and entrepreneurial decision-making.',
    skills: ['Startup Planning', 'Business Models', 'Innovation', 'Team Leadership'],
    difficulty: 'Advanced'
  },
  {
    id: 'ftdm',
    name: 'Financial Services Team Decision Making',
    shortName: 'Financial Services TDM',
    abbreviation: 'FTDM',
    category: 'team-decision',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-600',
    description: 'Financial planning, investment strategies, and risk management in team scenarios.',
    skills: ['Investment Analysis', 'Risk Management', 'Financial Planning', 'Client Relations'],
    difficulty: 'Advanced'
  },
  {
    id: 'htdm',
    name: 'Hospitality Services Team Decision Making',
    shortName: 'Hospitality Services TDM',
    abbreviation: 'HTDM',
    category: 'team-decision',
    icon: Coffee,
    color: 'from-amber-500 to-orange-600',
    description: 'Hotel operations, customer service, and hospitality management challenges.',
    skills: ['Customer Service', 'Operations Management', 'Quality Control', 'Team Coordination'],
    difficulty: 'Intermediate'
  },
  {
    id: 'mtdm',
    name: 'Marketing Management Team Decision Making',
    shortName: 'Marketing Management TDM',
    abbreviation: 'MTDM',
    category: 'team-decision',
    icon: Target,
    color: 'from-red-500 to-pink-600',
    description: 'Marketing strategy, campaign development, and market analysis as a team.',
    skills: ['Marketing Strategy', 'Campaign Planning', 'Market Research', 'Team Leadership'],
    difficulty: 'Advanced'
  },
  {
    id: 'stdm',
    name: 'Sports and Entertainment Marketing Team Decision Making',
    shortName: 'Sports & Entertainment TDM',
    abbreviation: 'STDM',
    category: 'team-decision',
    icon: Gamepad2,
    color: 'from-purple-500 to-indigo-600',
    description: 'Sports marketing, entertainment industry challenges, and fan engagement strategies.',
    skills: ['Sports Marketing', 'Event Management', 'Brand Partnerships', 'Fan Engagement'],
    difficulty: 'Intermediate'
  },
  {
    id: 'ttdm',
    name: 'Travel and Tourism Team Decision Making',
    shortName: 'Travel & Tourism TDM',
    abbreviation: 'TTDM',
    category: 'team-decision',
    icon: Plane,
    color: 'from-blue-500 to-cyan-600',
    description: 'Tourism planning, destination marketing, and travel industry management.',
    skills: ['Tourism Planning', 'Destination Marketing', 'Cultural Awareness', 'Sustainable Tourism'],
    difficulty: 'Intermediate'
  },

  // Marketing & Sales Events
  {
    id: 'aam',
    name: 'Apparel and Accessories Marketing Series',
    shortName: 'Apparel & Accessories',
    abbreviation: 'AAM',
    category: 'marketing',
    icon: Shirt,
    color: 'from-pink-500 to-rose-500',
    description: 'Fashion marketing, retail strategies, and brand development for apparel industry.',
    skills: ['Fashion Marketing', 'Brand Development', 'Trend Analysis', 'Retail Strategy'],
    difficulty: 'Intermediate'
  },
  {
    id: 'asm',
    name: 'Automotive Services Marketing Series',
    shortName: 'Automotive Services',
    abbreviation: 'ASM',
    category: 'marketing',
    icon: Car,
    color: 'from-gray-500 to-slate-600',
    description: 'Automotive industry marketing, service promotion, and customer retention strategies.',
    skills: ['Automotive Marketing', 'Service Sales', 'Customer Retention', 'Technical Knowledge'],
    difficulty: 'Intermediate'
  },
  {
    id: 'bsm',
    name: 'Business Services Marketing Series',
    shortName: 'Business Services',
    abbreviation: 'BSM',
    category: 'marketing',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    description: 'B2B marketing, service marketing, and client relationship management.',
    skills: ['B2B Marketing', 'Service Marketing', 'Client Relations', 'Proposal Writing'],
    difficulty: 'Intermediate'
  },
  {
    id: 'fms',
    name: 'Food Marketing Series',
    shortName: 'Food Marketing',
    abbreviation: 'FMS',
    category: 'marketing',
    icon: UtensilsCrossed,
    color: 'from-orange-500 to-red-600',
    description: 'Food industry marketing, product development, and consumer behavior analysis.',
    skills: ['Food Marketing', 'Consumer Behavior', 'Product Development', 'Brand Strategy'],
    difficulty: 'Intermediate'
  },
  {
    id: 'mcs',
    name: 'Marketing Communications Series',
    shortName: 'Marketing Communications',
    abbreviation: 'MCS',
    category: 'marketing',
    icon: Phone,
    color: 'from-green-500 to-teal-600',
    description: 'Integrated marketing communications, advertising, and brand messaging strategies.',
    skills: ['Integrated Marketing', 'Advertising', 'Brand Messaging', 'Digital Marketing'],
    difficulty: 'Intermediate'
  },
  {
    id: 'sem',
    name: 'Sports and Entertainment Marketing Series',
    shortName: 'Sports & Entertainment',
    abbreviation: 'SEM',
    category: 'marketing',
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-600',
    description: 'Sports and entertainment industry marketing, sponsorship, and media strategies.',
    skills: ['Sports Marketing', 'Entertainment Marketing', 'Sponsorship', 'Media Relations'],
    difficulty: 'Intermediate'
  },

  // Finance & Accounting Events
  {
    id: 'act',
    name: 'Accounting Applications Series',
    shortName: 'Accounting Applications',
    abbreviation: 'ACT',
    category: 'finance',
    icon: Calculator,
    color: 'from-green-500 to-emerald-600',
    description: 'Financial accounting, bookkeeping, and business financial analysis.',
    skills: ['Financial Accounting', 'Bookkeeping', 'Financial Analysis', 'Tax Preparation'],
    difficulty: 'Intermediate'
  },
  {
    id: 'bfs',
    name: 'Business Finance Series',
    shortName: 'Business Finance',
    abbreviation: 'BFS',
    category: 'finance',
    icon: DollarSign,
    color: 'from-emerald-500 to-green-600',
    description: 'Corporate finance, investment analysis, and financial planning strategies.',
    skills: ['Corporate Finance', 'Investment Analysis', 'Financial Planning', 'Risk Assessment'],
    difficulty: 'Advanced'
  },

  // Entrepreneurship Events
  {
    id: 'ent',
    name: 'Entrepreneurship Series',
    shortName: 'Entrepreneurship',
    abbreviation: 'ENT',
    category: 'entrepreneurship',
    icon: Lightbulb,
    color: 'from-yellow-500 to-amber-600',
    description: 'Business startup, innovation, and entrepreneurial skill development.',
    skills: ['Business Planning', 'Innovation', 'Startup Strategy', 'Pitch Development'],
    difficulty: 'Intermediate'
  },

  // Business Management Events
  {
    id: 'hrm',
    name: 'Human Resources Management Series',
    shortName: 'Human Resources',
    abbreviation: 'HRM',
    category: 'management',
    icon: Users,
    color: 'from-indigo-500 to-blue-600',
    description: 'HR management, employee relations, and organizational development.',
    skills: ['HR Management', 'Employee Relations', 'Recruitment', 'Performance Management'],
    difficulty: 'Advanced'
  },
  {
    id: 'qsrm',
    name: 'Quick Serve Restaurant Management Series',
    shortName: 'Quick Serve Restaurant',
    abbreviation: 'QSRM',
    category: 'management',
    icon: Coffee,
    color: 'from-orange-500 to-yellow-600',
    description: 'Fast-casual restaurant operations, efficiency, and customer service.',
    skills: ['Restaurant Operations', 'Food Safety', 'Staff Management', 'Customer Service'],
    difficulty: 'Intermediate'
  },
  {
    id: 'rfsm',
    name: 'Restaurant and Food Service Management Series',
    shortName: 'Restaurant & Food Service',
    abbreviation: 'RFSM',
    category: 'management',
    icon: UtensilsCrossed,
    color: 'from-red-500 to-orange-600',
    description: 'Full-service restaurant management, culinary operations, and hospitality.',
    skills: ['Restaurant Management', 'Culinary Operations', 'Cost Control', 'Hospitality'],
    difficulty: 'Advanced'
  },
  {
    id: 'rms',
    name: 'Retail Merchandising Series',
    shortName: 'Retail Merchandising',
    abbreviation: 'RMS',
    category: 'management',
    icon: ShoppingBag,
    color: 'from-pink-500 to-purple-600',
    description: 'Retail operations, merchandising strategies, and inventory management.',
    skills: ['Merchandising', 'Inventory Management', 'Visual Merchandising', 'Retail Analytics'],
    difficulty: 'Intermediate'
  },

  // Hospitality & Tourism Events
  {
    id: 'hlm',
    name: 'Hotel and Lodging Management Series',
    shortName: 'Hotel & Lodging',
    abbreviation: 'HLM',
    category: 'hospitality',
    icon: Home,
    color: 'from-blue-500 to-cyan-600',
    description: 'Hotel operations, guest services, and lodging industry management.',
    skills: ['Hotel Operations', 'Guest Services', 'Revenue Management', 'Hospitality Law'],
    difficulty: 'Advanced'
  },
  {
    id: 'pht',
    name: 'Principles of Hospitality and Tourism',
    shortName: 'Hospitality & Tourism Principles',
    abbreviation: 'PHT',
    category: 'hospitality',
    icon: Plane,
    color: 'from-teal-500 to-blue-600',
    description: 'Fundamental principles of hospitality management and tourism industry basics.',
    skills: ['Hospitality Fundamentals', 'Tourism Basics', 'Customer Service', 'Cultural Awareness'],
    difficulty: 'Beginner'
  },

  // Principles Events
  {
    id: 'pbm',
    name: 'Principles of Business Management and Administration',
    shortName: 'Business Management Principles',
    abbreviation: 'PBM',
    category: 'principles',
    icon: Briefcase,
    color: 'from-slate-500 to-gray-600',
    description: 'Fundamental business management principles and administrative functions.',
    skills: ['Management Fundamentals', 'Business Administration', 'Leadership', 'Operations'],
    difficulty: 'Beginner'
  },
  {
    id: 'pen',
    name: 'Principles of Entrepreneurship',
    shortName: 'Entrepreneurship Principles',
    abbreviation: 'PEN',
    category: 'principles',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500',
    description: 'Core entrepreneurship concepts and business creation fundamentals.',
    skills: ['Entrepreneurship Basics', 'Business Planning', 'Innovation', 'Risk Assessment'],
    difficulty: 'Beginner'
  },
  {
    id: 'pfn',
    name: 'Principles of Finance',
    shortName: 'Finance Principles',
    abbreviation: 'PFN',
    category: 'principles',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-600',
    description: 'Basic financial principles, accounting fundamentals, and financial literacy.',
    skills: ['Financial Literacy', 'Accounting Basics', 'Investment Principles', 'Financial Analysis'],
    difficulty: 'Beginner'
  },
  {
    id: 'pmk',
    name: 'Principles of Marketing',
    shortName: 'Marketing Principles',
    abbreviation: 'PMK',
    category: 'principles',
    icon: Target,
    color: 'from-blue-500 to-purple-600',
    description: 'Fundamental marketing concepts and basic marketing strategy principles.',
    skills: ['Marketing Fundamentals', 'Consumer Behavior', 'Product Strategy', 'Promotion'],
    difficulty: 'Beginner'
  }
];

// Helper functions
export const getEventsByCategory = (categoryId: string) => {
  if (categoryId === 'all') return events;
  return events.filter(event => event.category === categoryId);
};

export const searchEvents = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return events.filter(event => 
    event.name.toLowerCase().includes(lowercaseQuery) ||
    event.shortName.toLowerCase().includes(lowercaseQuery) ||
    event.abbreviation.toLowerCase().includes(lowercaseQuery) ||
    event.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
  );
};

export const getEventById = (id: string) => {
  return events.find(event => event.id === id);
};