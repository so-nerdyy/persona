import React from 'react';
import { useRoleplay } from './hooks/useRoleplay';
import { Home } from './components/Home';
import { RoleplaySession } from './components/RoleplaySession';
import { FeedbackCard } from './components/FeedbackCard';
import { PreparationPhase } from './components/PreparationPhase';
import BackgroundEffects from './components/BackgroundEffects';
import LoadingSpinner from './components/LoadingSpinner';
import { Login } from './components/Login';
import { useAuth } from './context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const {
    gameState,
    scenario,
    messages,
    currentTranscript,
    grade,
    error,
    preparationTimeLeft,
    presentationTimeLeft,
    notes,
    setNotes,
    startScenario,
    finishRoleplay,
    skipPreparation
  } = useRoleplay();

  const [difficulty, setDifficulty] = React.useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <LoadingSpinner color="blue" title="Loading..." subtitle="Checking authentication" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  // Enhanced transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 1.05 }
  };

  const loadingVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.2 }
  };

  const transitionSettings = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8
  };

  return (
    <div className="min-h-screen text-white selection:bg-blue-500/30 overflow-hidden relative">
      <BackgroundEffects />

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-10 max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight leading-none">Persona</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">AI Roleplay Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:inline">
              Welcome, <span className="text-white font-medium">{user.username}</span>
            </span>
            {gameState !== 'IDLE' && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-colors border border-white/5"
              >
                Exit Session
              </button>
            )}
            {gameState === 'IDLE' && (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm font-medium text-red-300 transition-colors border border-red-500/20"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200"
            >
              <AlertTriangle size={20} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="min-h-[600px]">
          <AnimatePresence
            mode="wait"
            initial={false}
            custom={gameState}
          >
            {gameState === 'IDLE' && (
              <motion.div
                key="idle"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={transitionSettings}
              >
                <Home
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  onStartScenario={startScenario}
                />
              </motion.div>
            )}

            {gameState === 'GENERATING' && (
              <motion.div
                key="generating"
                variants={loadingVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={transitionSettings}
                className="flex flex-col items-center justify-center h-[50vh]"
              >
                <LoadingSpinner
                  color="blue"
                  title="Generating Scenario..."
                  subtitle="Consulting the DECA gods"
                />
              </motion.div>
            )}

            {gameState === 'PREPARING' && scenario && (
              <motion.div
                key="preparing"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={transitionSettings}
              >
                <PreparationPhase
                  scenario={scenario}
                  preparationTimeLeft={preparationTimeLeft}
                  notes={notes}
                  setNotes={setNotes}
                  onSkipPreparation={skipPreparation}
                />
              </motion.div>
            )}

            {gameState === 'PLAYING' && scenario && (
               <motion.div
                 key="playing"
                 variants={pageVariants}
                 initial="initial"
                 animate="in"
                 exit="out"
                 transition={transitionSettings}
               >
                 <RoleplaySession
                   scenario={scenario}
                   messages={messages}
                   currentTranscript={currentTranscript}
                   presentationTimeLeft={presentationTimeLeft}
                   onFinish={finishRoleplay}
                   showScenario={false}
                   notes={notes}
                 />
               </motion.div>
             )}

            {gameState === 'GRADING' && (
              <motion.div
                key="grading"
                variants={loadingVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={transitionSettings}
                className="flex flex-col items-center justify-center h-[50vh]"
              >
                <LoadingSpinner
                  color="purple"
                  title="The Judge is Deliberating..."
                  subtitle="Analyzing your performance indicators"
                />
              </motion.div>
            )}

            {gameState === 'FINISHED' && grade && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    ...transitionSettings,
                    type: "spring",
                    bounce: 0.4
                  }
                }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
              >
                <FeedbackCard grade={grade} onRestart={() => window.location.reload()} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
