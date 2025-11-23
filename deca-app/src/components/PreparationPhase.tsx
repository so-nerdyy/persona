import React, { useState } from "react";
import { Clock, BookOpen, Timer, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoleplayScenario } from "../services/ai";
import type { Note } from "../hooks/useRoleplay";

interface PreparationPhaseProps {
  scenario: RoleplayScenario;
  preparationTimeLeft: number;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  onSkipPreparation: () => void;
}

export const PreparationPhase: React.FC<PreparationPhaseProps> = ({
  scenario,
  preparationTimeLeft,
  notes,
  setNotes,
  onSkipPreparation,
}) => {
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalPrepTime = (scenario.prepTimeMinutes || 10) * 60; // Convert minutes to seconds
  const timePercentage = (preparationTimeLeft / totalPrepTime) * 100;

  const addNote = () => {
    console.log("➕ Adding new note...");
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
    };
    console.log("✅ New note created:", newNote);
    setNotes([...notes, newNote]);
    setExpandedNoteId(newNote.id);
    console.log("📝 Note added to list, total notes:", notes.length + 1);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    console.log("✏️ Updating note:", id, updates);
    setNotes(notes.map(note => note.id === id ? { ...note, ...updates } : note));
  };

  const deleteNote = (id: string) => {
    console.log("🗑️ Deleting note:", id);
    setNotes(notes.filter(note => note.id !== id));
    if (expandedNoteId === id) {
      setExpandedNoteId(null);
    }
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-140px)] max-w-6xl mx-auto gap-4 xs:gap-8 overflow-hidden px-4 xs:px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-4 xs:left-10 w-24 h-24 xs:w-32 xs:h-32 bg-gradient-radial opacity-20 animate-float"></div>
        <div
          className="absolute top-20 right-4 xs:right-20 w-16 h-16 xs:w-24 xs:h-24 bg-gradient-conic opacity-15 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 xs:w-20 xs:h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header with Timer */}
      <motion.div
        className="relative glass-panel rounded-2xl p-4 xs:p-8 border-white/10 hover-lift glow-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
          <div className="flex items-center gap-3 xs:gap-4">
            <motion.div
              className="w-12 h-12 xs:w-14 xs:h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg glow-primary hover-scale touch-target"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Timer size={24} className="xs:w-7 xs:h-7 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl xs:text-3xl font-bold text-gradient-primary">
                Preparation Phase
              </h2>
              <p className="text-gray-400 text-xs xs:text-sm mt-1">
                Review your scenario and prepare your pitch
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 xs:gap-6 w-full xs:w-auto justify-between xs:justify-end">
            <div className="text-center xs:text-right">
              <div className="text-xl xs:text-3xl font-mono font-bold text-gradient">
                {formatTime(preparationTimeLeft)}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Time Remaining
              </div>
            </div>
            <div className="relative">
              <motion.div
                className="relative w-16 h-16 xs:w-20 xs:h-20"
                animate={{
                  rotate: preparationTimeLeft > 0 ? 360 : 0,
                }}
                transition={{
                  duration: 60,
                  repeat: preparationTimeLeft > 0 ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <svg
                  className="w-16 h-16 xs:w-20 xs:h-20 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <defs>
                    <linearGradient
                      id="timerGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <motion.path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${timePercentage}, 100`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${timePercentage}, 100` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: preparationTimeLeft <= 60 ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: preparationTimeLeft <= 60 ? Infinity : 0,
                    }}
                  >
                    <Clock
                      size={18}
                      className="xs:w-6 xs:h-6 text-white drop-shadow-lg"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <motion.button
              onClick={onSkipPreparation}
              className="btn btn-primary btn-lg glow-primary hover-lift touch-target"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-8">
        {/* Scenario Details */}
        <motion.div
          className="glass-panel rounded-2xl p-4 xs:p-8 border-white/10 hover-lift gradient-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6">
            <motion.div
              className="p-1.5 xs:p-2 bg-gradient-primary rounded-lg glow-primary touch-target flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <BookOpen size={20} className="xs:w-6 xs:h-6 text-white" />
            </motion.div>
            <h3 className="text-lg xs:text-2xl font-bold text-gradient-primary">
              Scenario Details
            </h3>
          </div>

          <div className="space-y-6">
            <motion.div
              className="space-y-2 xs:space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-lg xs:text-xl font-semibold text-white leading-tight">
                {scenario.title}
              </h4>
              <motion.span
                className="inline-flex items-center px-2 xs:px-3 py-1.5 xs:py-2 rounded-full bg-gradient-primary/20 text-primary text-xs xs:text-sm font-bold border border-primary/30 glow-primary touch-target"
                whileHover={{ scale: 1.05 }}
              >
                👨‍⚖️ Judge: {scenario.judgePersona}
              </motion.span>
            </motion.div>

            <motion.div
              className="p-3 xs:p-4 bg-white/5 rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-300 leading-relaxed text-sm xs:text-base">
                {scenario.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h5 className="text-xs xs:text-sm font-semibold text-gray-400 mb-2 xs:mb-3 uppercase tracking-wide">
                Performance Indicators (KPIs)
              </h5>
              <div className="flex flex-wrap gap-2 xs:gap-3">
                {scenario.performanceIndicators.map((kpi, i) => (
                  <motion.span
                    key={i}
                    className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-300 text-xs xs:text-sm border border-white/10 hover-lift cursor-default touch-target"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    {kpi}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Notepad */}
        <motion.div
          className="glass-panel rounded-2xl p-4 xs:p-8 border-white/10 flex flex-col hover-lift gradient-border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center justify-between mb-4 xs:mb-6">
            <div className="flex items-center gap-2 xs:gap-3">
              <motion.div
                className="p-1.5 xs:p-2 bg-gradient-accent rounded-lg glow-secondary touch-target flex items-center justify-center"
                whileHover={{ rotate: -5, scale: 1.1 }}
              >
                <BookOpen size={20} className="xs:w-6 xs:h-6 text-white" />
              </motion.div>
              <h3 className="text-lg xs:text-2xl font-bold text-gradient-accent">
                Preparation Notes
              </h3>
            </div>
            <motion.button
              type="button"
              onClick={() => {
                console.log("🖱️ Add Note button clicked!");
                addNote();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 text-sm font-bold shadow-xl glow-primary"
            >
              <Plus size={18} />
              Add Note
            </motion.button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
            <AnimatePresence>
              {notes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-gray-400"
                >
                  <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notes yet. Click "Add Note" to start.</p>
                </motion.div>
              ) : (
                notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-3 xs:p-4 rounded-xl border border-white/10 hover-lift"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => updateNote(note.id, { title: e.target.value })}
                        placeholder="Note Title..."
                        className="flex-1 bg-transparent border-b border-white/20 text-white font-semibold placeholder-gray-500 focus:outline-none focus:border-accent/50 text-sm xs:text-base px-2 py-1"
                      />
                      <motion.button
                        onClick={() => deleteNote(note.id)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, { content: e.target.value })}
                      placeholder="Write your notes here..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2 xs:p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none text-xs xs:text-sm"
                      rows={3}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="text-xs text-gray-400 mt-3 xs:mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Notes are automatically saved locally
          </motion.div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <motion.div
        className="glass-panel rounded-2xl p-4 xs:p-6 border-white/10 hover-lift gradient-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center justify-between text-xs xs:text-sm mb-3 xs:mb-4">
          <span className="text-gray-400 font-medium">
            Preparation Progress
          </span>
          <motion.span
            className="text-white font-mono font-bold text-base xs:text-lg"
            key={Math.round(((600 - preparationTimeLeft) / 600) * 100)}
            initial={{ scale: 1.2, color: "var(--color-accent)" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(((totalPrepTime - preparationTimeLeft) / totalPrepTime) * 100)}%
          </motion.span>
        </div>
        <div className="relative w-full bg-gray-700/50 rounded-full h-2 xs:h-3 mt-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 xs:h-3 rounded-full shadow-lg"
            initial={{ width: "100%" }}
            animate={{ width: `${timePercentage}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span>Ready to Begin</span>
        </div>
      </motion.div>
    </div>
  );
};
