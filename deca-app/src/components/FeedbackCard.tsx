import React from "react";
import {
  CheckCircle,
  XCircle,
  Trophy,
  RefreshCw,
  Star,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

interface FeedbackCardProps {
  grade: {
    score: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
  };
  onRestart: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  grade = {
    score: 87,
    feedback:
      "Excellent performance in this assessment. Your strategic thinking and decision-making were outstanding.",
    strengths: [
      "Strong analytical skills",
      "Great communication",
      "Quick problem-solving",
      "Team collaboration",
    ],
    weaknesses: [
      "Time management needs improvement",
      "Could be more detailed in documentation",
    ],
  },
  onRestart = () => {},
}) => {
  const scoreColor =
    grade.score >= 90
      ? "text-green-400"
      : grade.score >= 70
      ? "text-yellow-400"
      : "text-red-400";
  const scoreGradient =
    grade.score >= 90
      ? "bg-gradient-to-br from-green-400 to-emerald-600"
      : grade.score >= 70
      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
      : "bg-gradient-to-br from-red-400 to-rose-600";
  const glowClass =
    grade.score >= 90
      ? "glow-primary"
      : grade.score >= 70
      ? "glow"
      : "glow-secondary";

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (grade.score / 100) * circumference;

  const orbs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-auto">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className={`absolute rounded-full ${scoreGradient} opacity-5 blur-3xl`}
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: orb.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:sticky lg:top-8 lg:h-fit panel-elevated rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden gradient-border hover-lift bg-slate-800/50 backdrop-blur"
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 ${scoreGradient} opacity-20`}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
              style={{ backgroundSize: "200% 200%" }}
            />

            {/* Floating stars for high scores */}
            {grade.score >= 90 && (
              <>
                <motion.div
                  className="absolute top-6 right-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-8 h-8 text-yellow-400 fill-current" />
                </motion.div>
                <motion.div
                  className="absolute bottom-6 left-6"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Award className="w-7 h-7 text-yellow-400" />
                </motion.div>
              </>
            )}

            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/10"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                  className={`${scoreColor} ${glowClass}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className={`text-5xl sm:text-6xl font-black text-gradient-primary mb-1`}
                >
                  {grade.score}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-xs text-gray-400 uppercase tracking-widest font-semibold"
                >
                  Score
                </motion.span>
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-xl sm:text-2xl font-bold text-gradient mb-4 font-display"
            >
              {grade.score >= 90
                ? "🏆 National Qualifier!"
                : grade.score >= 70
                ? "⭐ Solid Performance"
                : "📈 Room for Growth"}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="w-full mt-4"
            >
              <button
                onClick={onRestart}
                className="btn btn-primary w-full hover-scale focus-ring touch-target bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base"
              >
                <RefreshCw size={20} />
                Try Another Scenario
              </button>
            </motion.div>
          </motion.div>

          {/* Feedback Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Main Feedback */}
            <motion.div
              className="panel-elevated rounded-2xl p-5 sm:p-6 lg:p-8 gradient-border bg-slate-800/50 backdrop-blur"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl sm:text-2xl font-bold text-gradient-primary mb-4 flex items-center gap-2 sm:gap-3 font-display"
              >
                <Trophy size={20} className="sm:w-6 sm:h-6 text-yellow-400" />
                Judge's Feedback
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-300 leading-relaxed text-sm sm:text-base italic border-l-4 border-primary pl-4"
              >
                "{grade.feedback}"
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Strengths */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="card hover-lift bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5 sm:p-6 lg:p-8 bg-slate-800/50 backdrop-blur"
              >
                <motion.h4
                  className="flex items-center gap-2 sm:gap-3 text-green-400 font-bold mb-4 sm:mb-6 font-display text-base sm:text-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <CheckCircle
                    size={18}
                    className="sm:w-5 sm:h-5 text-green-400"
                  />
                  Strengths
                </motion.h4>
                <ul className="space-y-3 sm:space-y-4">
                  {grade.strengths.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.4 + i * 0.15,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base leading-relaxed"
                    >
                      <motion.span
                        className="mt-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 shrink-0"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          delay: 1.6 + i * 0.15,
                          duration: 0.6,
                          repeat: Infinity,
                        }}
                      />
                      <span className="flex-1">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Weaknesses */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="card hover-lift bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 rounded-2xl p-5 sm:p-6 lg:p-8 bg-slate-800/50 backdrop-blur"
              >
                <motion.h4
                  className="flex items-center gap-2 sm:gap-3 text-red-400 font-bold mb-4 sm:mb-6 font-display text-base sm:text-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <XCircle size={18} className="sm:w-5 sm:h-5 text-red-400" />
                  Areas to Improve
                </motion.h4>
                <ul className="space-y-3 sm:space-y-4">
                  {grade.weaknesses.map((w, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.4 + i * 0.15,
                        type: "spring",
                        stiffness: 100,
                      }}
                      className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base leading-relaxed"
                    >
                      <motion.span
                        className="mt-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400 shrink-0"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          delay: 1.6 + i * 0.15,
                          duration: 0.6,
                          repeat: Infinity,
                        }}
                      />
                      <span className="flex-1">{w}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
