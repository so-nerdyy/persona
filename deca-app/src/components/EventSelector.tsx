import React from 'react';
import { Briefcase, TrendingUp, Users, ShoppingBag, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const events = [
    {
        id: 'marketing',
        name: 'Marketing Management',
        icon: ShoppingBag,
        color: 'from-pink-500 to-rose-500',
        desc: 'Product promotion, pricing strategies, and market research.'
    },
    {
        id: 'finance',
        name: 'Business Finance',
        icon: DollarSign,
        color: 'from-green-500 to-emerald-600',
        desc: 'Financial planning, investment analysis, and accounting.'
    },
    {
        id: 'hospitality',
        name: 'Hospitality & Tourism',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
        desc: 'Customer service, travel planning, and event management.'
    },
    {
        id: 'entrepreneurship',
        name: 'Entrepreneurship',
        icon: TrendingUp,
        color: 'from-purple-500 to-indigo-600',
        desc: 'Business startup, innovation, and growth strategies.'
    },
    {
        id: 'management',
        name: 'Business Management',
        icon: Briefcase,
        color: 'from-orange-500 to-amber-500',
        desc: 'HR, operations, and strategic leadership.'
    },
];

interface EventSelectorProps {
    onSelect: (eventId: string) => void;
    disabled: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const EventSelector: React.FC<EventSelectorProps> = ({ onSelect, disabled }) => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto p-4"
        >
            {events.map((evt) => (
                <motion.button
                  key={evt.id}
                  variants={item}
                  onClick={() => onSelect(evt.name)}
                  disabled={disabled}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 p-1 text-left transition-all hover:bg-white/10 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl touch-target"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl p-6 flex flex-col overflow-hidden">
                        {/* Background Icon Blob */}
                        <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${evt.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-all duration-500`} />

                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${evt.color} text-white mb-4 shadow-lg w-fit group-hover:scale-110 transition-transform duration-300`}>
                            <evt.icon size={24} />
                        </div>

                        <h3 className="text-lg xs:text-xl font-bold text-white mb-2 font-display group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                          {evt.name}
                        </h3>

                        <p className="text-xs xs:text-sm text-gray-400 mb-4 xs:mb-6 line-clamp-2 leading-relaxed">
                          {evt.desc}
                        </p>

                        <div className="mt-auto flex items-center text-xs xs:text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                          <span>Start Roleplay</span>
                          <ArrowRight size={14} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                    </div>
                </motion.button>
            ))}
        </motion.div>
    );
};
