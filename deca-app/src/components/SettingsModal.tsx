import React from 'react';
import { motion } from 'framer-motion';
import { Settings, X, Mic, Save } from 'lucide-react';
import { Button } from './Button';

interface SettingsModalProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  handleSaveSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isSettingsOpen,
  setIsSettingsOpen,
  voiceSpeed,
  setVoiceSpeed,
  difficulty,
  setDifficulty,
  handleSaveSettings,
}) => {
  if (!isSettingsOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={() => setIsSettingsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-modal max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 id="settings-title" className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg" aria-hidden="true">
              <Settings size={20} className="text-white" />
            </div>
            Settings
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 hover-lift"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-8">
          {/* Voice Speed */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold flex items-center gap-2">
              <Mic size={16} className="text-blue-400" />
              Voice Speed
            </label>
            <div className="glass-card p-4">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0.5x</span>
                <span className="font-semibold text-white">{voiceSpeed}x</span>
                <span>2x</span>
              </div>
            </div>
          </div>

          {/* Difficulty Preference */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Default Difficulty</label>
            <div className="glass-card p-2">
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <Button
                    key={d}
                    variant={difficulty === d ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setDifficulty(d)}
                    className="py-3 px-4 rounded-lg font-medium transition-all"
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSaveSettings}
          className="w-full mt-8"
          leftIcon={<Save size={16} />}
        >
          Save Settings
        </Button>
      </motion.div>
    </motion.div>
  );
};