import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, User, Bot, ChevronDown, ChevronUp, Activity, Radio, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RoleplayScenario } from '../services/ai';
import type { Message, Note } from '../hooks/useRoleplay';

interface RoleplaySessionProps {
    scenario: RoleplayScenario;
    messages: Message[];
    currentTranscript: string;
    presentationTimeLeft?: number;
    onFinish: () => void;
    showScenario?: boolean;
    notes?: Note[];
}

export const RoleplaySession: React.FC<RoleplaySessionProps> = ({
    scenario,
    messages,
    currentTranscript,
    presentationTimeLeft = 600,
    onFinish,
    showScenario = true,
    notes = [],
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScenarioExpanded, setIsScenarioExpanded] = useState(false);
    const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, currentTranscript]);

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-6xl mx-auto gap-4 xs:gap-6 relative px-4 xs:px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-radial opacity-20"></div>
            <div className="absolute top-10 left-4 xs:left-10 w-48 h-48 xs:w-64 xs:h-64 bg-gradient-primary rounded-full blur-3xl opacity-15 animate-float"></div>
            <div className="absolute bottom-10 right-4 xs:right-10 w-56 h-56 xs:w-80 xs:h-80 bg-gradient-secondary rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 xs:w-96 xs:h-96 bg-gradient-accent rounded-full blur-3xl opacity-5 animate-float" style={{ animationDelay: '3s' }}></div>

            {/* Scenario Header (Collapsible) */}
            {showScenario && (
                <motion.div
                    className="glass-panel rounded-3xl overflow-hidden shrink-0 border-white/10 shadow-2xl hover-lift"
                    initial={false}
                    animate={{ height: isScenarioExpanded ? 'auto' : '88px' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <motion.div
                        className="p-6 xs:p-8 cursor-pointer flex items-start justify-between hover:bg-white/5 transition-all duration-300 rounded-2xl touch-target"
                        onClick={() => setIsScenarioExpanded(!isScenarioExpanded)}
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="flex-1">
                            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 mb-3">
                                <h2 className="text-lg xs:text-2xl font-bold text-gradient-primary font-display">
                                    {scenario.title}
                                </h2>
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="px-2 xs:px-3 py-1 xs:py-1.5 rounded-full bg-gradient-primary text-white text-xs xs:text-sm font-bold border border-primary/30 shadow-lg shadow-primary/20 glow-primary touch-target self-start"
                                >
                                    👨‍⚖️ Judge: {scenario.judgePersona}
                                </motion.span>
                            </div>
                            <AnimatePresence>
                                {isScenarioExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-gray-300 text-sm xs:text-base mt-4 space-y-4 xs:space-y-6 overflow-hidden"
                                    >
                                        <p className="leading-relaxed">{scenario.description}</p>
                                        <div className="flex flex-wrap gap-3 xs:gap-4">
                                            {scenario.performanceIndicators.map((kpi, i) => (
                                                <motion.span
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-2 xs:px-3 py-1.5 xs:py-2 rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 text-accent-light text-xs xs:text-sm font-medium border border-accent/30 shadow-lg hover-lift glow-accent touch-target"
                                                >
                                                    🎯 {kpi}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {!isScenarioExpanded && (
                                <p className="text-gray-400 text-sm truncate">{scenario.description}</p>
                            )}
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
                            {isScenarioExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </motion.div>
                </motion.div>
            )}

            {/* Chat Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 relative glass-panel rounded-3xl overflow-hidden flex flex-col border-white/10 shadow-2xl"
            >
                {/* HUD Overlay Elements */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-4 right-4 flex items-center gap-3 text-xs font-mono text-primary-light/80 pointer-events-none z-10"
                >
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <Activity size={12} className="animate-pulse" />
                        <span className="font-semibold">LIVE_CONNECTION</span>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
                    </div>
                </motion.div>

                {/* Notes Panel Toggle */}
                {notes && notes.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsNotesPanelOpen(!isNotesPanelOpen)}
                        className="absolute top-4 left-4 p-3 sm:p-4 glass-button hover-lift glow-primary group z-10 flex items-center gap-2"
                        title="Toggle Notes"
                    >
                        <FileText size={20} className="sm:w-6 sm:h-6 group-hover:text-primary transition-colors" />
                        {isNotesPanelOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </motion.button>
                )}

                <div className="flex-1 overflow-y-auto p-4 xs:p-6 space-y-4 xs:space-y-6 scroll-smooth" ref={scrollRef}>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col items-center justify-center h-full text-gray-400 space-y-6"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-secondary rounded-full blur-xl opacity-30"></div>
                                <div className="relative p-4 bg-gradient-secondary rounded-2xl shadow-xl">
                                    <Bot size={48} className="text-white" />
                                </div>
                            </motion.div>
                            <div className="text-center space-y-2 px-4">
                                <p className="text-base xs:text-lg font-medium text-gradient-primary">Judge is ready</p>
                                <p className="text-xs xs:text-sm text-gray-500">Start speaking to begin your roleplay session</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-primary-light">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                <span>Waiting for your voice...</span>
                            </div>
                        </motion.div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`flex gap-2 xs:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`relative w-10 h-10 xs:w-12 xs:h-12 rounded-2xl flex items-center justify-center shrink-0 ${msg.role === 'user'
                                ? 'bg-gradient-primary glow-primary'
                                : 'bg-gradient-secondary glow-secondary'
                                } hover-scale transition-all duration-300 touch-target`}>
                                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm"></div>
                                <div className="relative">
                                    {msg.role === 'user' ? <User size={18} className="xs:w-6 xs:h-6 text-white drop-shadow-lg" /> : <Bot size={18} className="xs:w-6 xs:h-6 text-white drop-shadow-lg" />}
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`max-w-[85%] xs:max-w-[80%] p-3 xs:p-5 rounded-3xl backdrop-blur-md border-2 shadow-xl hover-lift ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-primary/15 to-primary/5 text-white rounded-tr-md border-primary/30 glow-primary'
                                    : 'bg-gradient-to-br from-secondary/15 to-secondary/5 text-white rounded-tl-md border-secondary/30 glow-secondary'
                                    } transition-all duration-300`}
                            >
                                <div className="leading-relaxed text-sm xs:text-base">{msg.text}</div>
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Live Transcript (Ghost Text) */}
                    {currentTranscript && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="flex gap-2 xs:gap-4 flex-row-reverse"
                        >
                            <div className="relative w-10 h-10 xs:w-12 xs:h-12 rounded-2xl bg-gradient-primary/60 flex items-center justify-center shrink-0 glow-primary animate-pulse touch-target">
                                <div className="absolute inset-0 rounded-2xl bg-white/10 blur-sm"></div>
                                <User size={18} className="xs:w-6 xs:h-6 text-white drop-shadow-lg relative z-10" />
                            </div>
                            <motion.div
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="max-w-[85%] xs:max-w-[80%] p-3 xs:p-5 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary-light rounded-tr-md border-2 border-primary/20 border-dashed backdrop-blur-sm shadow-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="leading-relaxed text-sm xs:text-base">{currentTranscript}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Controls Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 xs:p-6 glass-panel border-t border-white/10 mx-2 xs:mx-4 mb-2 xs:mb-4 rounded-3xl shadow-2xl"
                >
                    <div className="flex flex-col xs:flex-row items-center justify-between gap-4 xs:gap-6">
                        <div className="flex items-center gap-4 xs:gap-6 flex-1 w-full xs:w-auto">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative group cursor-pointer touch-target"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300 animate-pulse"></div>
                                <div className="relative w-12 h-12 xs:w-14 xs:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300 glow">
                                    <Mic size={22} className="xs:w-7 xs:h-7 drop-shadow-lg" />
                                </div>
                            </motion.div>
                            <div className="space-y-1 xs:space-y-2 flex-1 xs:flex-initial">
                                <div className="flex items-center gap-2 xs:gap-3">
                                    <span className="text-white font-bold font-display text-base xs:text-lg">Recording Presentation</span>
                                    <div className="flex gap-1 items-end h-3 xs:h-4">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [4, 12, 4] }}
                                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1, ease: "easeInOut" }}
                                                className="w-1 xs:w-1.5 bg-gradient-to-t from-red-400 to-red-500 rounded-full shadow-sm"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 xs:gap-4">
                                    <div className="text-xs sm:text-sm font-mono flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                                        <span className="text-blue-300 font-bold">{formatTime(presentationTimeLeft)}</span>
                                        <span className="text-gray-400">remaining</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        <span>RECORDING</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onFinish}
                            className="btn btn-outline btn-lg hover-lift glow-primary group touch-target w-full xs:w-auto"
                        >
                            <Square size={16} className="xs:w-4.5 xs:h-4.5 fill-current group-hover:fill-red-400 transition-colors" />
                            Finish Roleplay
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Notes Side Panel */}
            <AnimatePresence>
                {isNotesPanelOpen && notes && notes.length > 0 && (
                    <motion.div
                        initial={{ x: -400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -400, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute left-0 top-0 bottom-0 w-80 sm:w-96 glass-panel border-r border-white/10 z-40 overflow-y-auto p-4 sm:p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-gradient-accent rounded-lg">
                                    <FileText size={18} className="sm:w-5 sm:h-5 text-white" />
                                </div>
                                <h3 className="text-base sm:text-xl font-bold text-gradient-primary">Your Notes</h3>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsNotesPanelOpen(false)}
                                className="p-2 glass-button hover-lift"
                            >
                                <X size={18} />
                            </motion.button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            {notes.map((note, index) => (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-3 sm:p-4 rounded-xl border border-white/10"
                                >
                                    {note.title && (
                                        <h4 className="text-sm sm:text-base font-semibold text-white mb-2 border-b border-white/10 pb-2">
                                            {note.title}
                                        </h4>
                                    )}
                                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {note.content}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-4 sm:mt-6 text-xs text-gray-400 text-center">
                            <p>Read-only during roleplay</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
