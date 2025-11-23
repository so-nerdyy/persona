import { useState, useEffect, useRef, useCallback } from 'react';
import { generateScenario, getAIResponse, gradeRoleplay, saveRoleplay, type RoleplayScenario, type Difficulty } from '../services/ai';
import { speechService } from '../services/speech';

export type GameState = 'IDLE' | 'GENERATING' | 'PREPARING' | 'PLAYING' | 'GRADING' | 'FINISHED';

export interface Message {
    role: 'user' | 'model';
    text: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
}

export const useRoleplay = () => {
    const [gameState, setGameState] = useState<GameState>('IDLE');
    const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [fullTranscript, setFullTranscript] = useState('');
    const [grade, setGrade] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [preparationTimeLeft, setPreparationTimeLeft] = useState(600); // 10 minutes in seconds
    const [presentationTimeLeft, setPresentationTimeLeft] = useState(600); // 10 minutes default
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('persona-roleplay-notes');
        try {
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const silenceTimer = useRef<any>(null);
    const isAIProcessing = useRef(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            speechService.stopListening();
            speechService.cancelSpeech();
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
        };
    }, []);

    // Persist notes to localStorage
    useEffect(() => {
        localStorage.setItem('persona-roleplay-notes', JSON.stringify(notes));
    }, [notes]);

    // Preparation timer countdown
    useEffect(() => {
        if (gameState === 'PREPARING' && preparationTimeLeft > 0) {
            const timer = setTimeout(() => {
                setPreparationTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'PREPARING' && preparationTimeLeft === 0) {
            skipPreparation();
        }
    }, [gameState, preparationTimeLeft]);

    // Presentation timer countdown
    useEffect(() => {
        if (gameState === 'PLAYING' && presentationTimeLeft > 0) {
            const timer = setTimeout(() => {
                setPresentationTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'PLAYING' && presentationTimeLeft === 0) {
            console.log("⏰ Presentation time is up! Auto-finishing...");
            finishRoleplay();
        }
    }, [gameState, presentationTimeLeft]);

    const startScenario = async (eventType: string, selectedDifficulty: Difficulty, options?: { topic?: string; mode?: string }) => {
        try {
            setGameState('GENERATING');
            setError(null);
            setDifficulty(selectedDifficulty);
            const newScenario = await generateScenario(eventType, selectedDifficulty, options);
            setScenario(newScenario);
            // Use prep time from scenario if available, otherwise default to 10 minutes
            const prepTime = newScenario.prepTimeMinutes ? newScenario.prepTimeMinutes * 60 : 600;
            setPreparationTimeLeft(prepTime);
            setGameState('PREPARING');
        } catch (err) {
            console.error(err);
            setError('Failed to generate scenario. Make sure backend is running.');
            setGameState('IDLE');
        }
    };

    const handleUserSpeech = useCallback((text: string, isFinal: boolean) => {
        console.log(`🗣️ Speech received (${isFinal ? 'FINAL' : 'interim'}):`, text);
        
        if (isFinal && text.trim().length > 0) {
            console.log("✅ Adding to transcript:", text);
            // Add to full transcript
            setFullTranscript(prev => prev ? `${prev} ${text}` : text);
            // Also add to messages for display
            setMessages(prev => [...prev, { role: 'user', text: text }]);
            setCurrentTranscript('');
        } else {
            // Show interim results
            setCurrentTranscript(text);
        }
    }, []);

    // Removed - no longer needed since we don't do back-and-forth during presentation

    const startListeningLoop = () => {
        speechService.startListening(handleUserSpeech, (err) => {
            // Only log actual errors (no-speech is handled in speech service)
            if (err && err !== 'no-speech' && err !== 'aborted') {
                console.error('Microphone error:', err);
                setError('Microphone error. Please check permissions.');
            }
        });
    };

    const finishRoleplay = async () => {
        console.log("🏁 Finishing roleplay...");
        console.log("📊 Full transcript length:", fullTranscript.length);
        console.log("📝 Full transcript:", fullTranscript);
        
        setGameState('GRADING');
        speechService.stopListening();
        speechService.cancelSpeech();
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        
        if (scenario && fullTranscript.trim().length > 0) {
            try {
                console.log("🎯 Calling grading API with KPIs:", scenario.performanceIndicators);
                const gradingResult = await gradeRoleplay(fullTranscript, scenario.performanceIndicators);
                console.log("✅ Grading result received:", gradingResult);
                setGrade(gradingResult);
                
                // Save roleplay to backend
                try {
                    console.log("💾 Saving roleplay to backend...");
                    const saveResult = await saveRoleplay({
                        eventType: scenario.title || 'Unknown Event',
                        scenarioTitle: scenario.title,
                        score: gradingResult.score,
                        feedback: gradingResult.feedback,
                        strengths: gradingResult.strengths,
                        weaknesses: gradingResult.weaknesses,
                        transcript: fullTranscript,
                        difficulty,
                        judgePersona: scenario.judgePersona,
                        performanceIndicators: scenario.performanceIndicators,
                        messages: messages.map(m => ({ role: m.role, text: m.text })),
                        keyTakeaway: gradingResult.keyTakeaway,
                    });
                    console.log("✅ Roleplay saved successfully:", saveResult);
                } catch (saveError) {
                    console.error('❌ Failed to save roleplay:', saveError);
                }
            } catch (err) {
                console.error('❌ Grading error:', err);
                setError('Failed to grade roleplay');
            }
        } else {
            console.error("❌ Cannot grade: missing scenario or empty transcript");
            setError('No presentation to grade. Please speak during your presentation.');
        }
        setGameState('FINISHED');
    };

    const skipPreparation = () => {
        console.log("▶️ Starting presentation phase...");
        
        // Set presentation time from scenario
        const presentationTime = (scenario?.presentationTimeMinutes || 10) * 60;
        setPresentationTimeLeft(presentationTime);
        
        // Add initial judge message
        const initialMessage = `Good ${getTimeOfDay()}! I'm your judge today. You may begin your presentation whenever you're ready. You have ${scenario?.presentationTimeMinutes || 10} minutes.`;
        console.log("👨‍⚖️ Initial judge message:", initialMessage);
        
        setMessages([{ role: 'model', text: initialMessage }]);
        setFullTranscript('');
        setGameState('PLAYING');
        
        // Speak the initial message, then start listening
        speechService.speak(initialMessage, () => {
            console.log("🎤 Starting to listen for presentation...");
            startListeningLoop();
        });
    };

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    };

    return {
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
        skipPreparation,
    };
};
