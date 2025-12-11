import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { events, categories, getEventsByCategory, searchEvents } from '../data/events';
import { ArrowRight, Search, Filter } from 'lucide-react';

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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    const displayedEvents = searchQuery 
        ? searchEvents(searchQuery)
        : getEventsByCategory(selectedCategory);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Search and Filter Section */}
            <div className="mb-6 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setSearchQuery('');
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedCategory === category.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <IconComponent size={14} />
                                {category.name}
                                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                                    {category.id === 'all' ? events.length : getEventsByCategory(category.id).length}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Events Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {displayedEvents.map((event) => {
                    const IconComponent = event.icon;
                    return (
                        <motion.button
                            key={event.id}
                            variants={item}
                            onClick={() => onSelect(event.abbreviation)}
                            disabled={disabled}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative overflow-hidden rounded-xl bg-white/5 p-1 text-left transition-all hover:bg-white/10 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl"
                        >
                            <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-sm rounded-lg p-4 flex flex-col">
                                {/* Background Icon Blob */}
                                <div className={`absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br ${event.color} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-all duration-300`} />

                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${event.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent size={18} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="text-sm font-bold text-white font-display truncate">
                                            {event.shortName}
                                        </h3>
                                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono mt-1 inline-block">
                                            {event.abbreviation}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                                    {event.description}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {event.skills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-auto flex items-center justify-between">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        event.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                                        event.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                                        'bg-red-600/20 text-red-400'
                                    }`}>
                                        {event.difficulty}
                                    </span>
                                    <div className="flex items-center text-xs font-medium text-gray-500 group-hover:text-white transition-colors">
                                        <span>Start</span>
                                        <ArrowRight size={12} className="ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* No Results */}
            {displayedEvents.length === 0 && (
                <div className="text-center py-12">
                    <Filter className="mx-auto text-gray-400 mb-4" size={40} />
                    <h3 className="text-lg font-semibold text-white mb-2">No events found</h3>
                    <p className="text-gray-400 text-sm">
                        {searchQuery 
                            ? `No events match "${searchQuery}". Try a different search term.`
                            : 'No events in this category.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};
