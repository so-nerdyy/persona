import { useState, useEffect, useRef, useCallback } from 'react';
import { generateScenario, getAIResponse, gradeRoleplay, saveRoleplay, checkShouldInterrupt, getJudgeFollowUp, type RoleplayScenario, type Difficulty } from '../services/ai';
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

    // Interruption state
    const [interruptCount, setInterruptCount] = useState(0);
    const [isJudgeSpeaking, setIsJudgeSpeaking] = useState(false);
    const [transcriptBuffer, setTranscriptBuffer] = useState<string[]>([]);
    const [isWaitingForClarification, setIsWaitingForClarification] = useState(false);

    const silenceTimer = useRef<any>(null);
    const isAIProcessing = useRef(false);
    const speechCountRef = useRef(0);
    const scenarioRef = useRef<RoleplayScenario | null>(null);
    const difficultyRef = useRef<Difficulty>(difficulty);
    const interruptCountRef = useRef(0);

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
            difficultyRef.current = selectedDifficulty;
            const newScenario = await generateScenario(eventType, selectedDifficulty, options);
            setScenario(newScenario);
            scenarioRef.current = newScenario;
            console.log("✅ Scenario set:", newScenario);
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
            
            // Add to messages for display
            setMessages(prev => [...prev, { role: 'user', text: text }]);
            
            setCurrentTranscript('');
            
            // Handle based on mode
            if (isWaitingForClarification) {
                // This is a response to judge's question
                console.log("💬 User responding to judge's question");
                handleClarificationResponse(text);
            } else {
                // Normal presentation - check for interruption
                console.log("📝 Normal presentation mode, checking for interrupt...");
                speechCountRef.current += 1;
                
                setTranscriptBuffer(prev => {
                    const newBuffer = [...prev, text];
                    console.log("🔄 Buffer updated, length:", newBuffer.length);
                    
                    // Check IMMEDIATELY after every speech
                    if (speechCountRef.current >= 1) {
                        console.log("✅ Triggering interrupt check with buffer:", newBuffer);
                        speechCountRef.current = 0;
                        // Call with the new buffer
                        setTimeout(() => {
                            console.log("⏰ Timeout fired, calling checkForInterrupt...");
                            checkForInterrupt(newBuffer);
                        }, 500);
                    }
                    
                    return newBuffer;
                });
            }
        } else {
            // Show interim results
            console.log("⏳ INTERIM - Setting currentTranscript to:", text);
            setCurrentTranscript(text);
            console.log("✅ currentTranscript state should now be:", text);
        }
    }, [isWaitingForClarification, isJudgeSpeaking]);

    const checkForInterrupt = async (buffer: string[]) => {
        // Use refs to get current values
        const currentScenario = scenarioRef.current;
        const currentDifficulty = difficultyRef.current;
        const currentInterruptCount = interruptCountRef.current;
        
        const maxInterrupts = { 'Easy': 3, 'Medium': 6, 'Hard': 10 }[currentDifficulty];

        console.log("🔍 Interrupt check details:", {
            interruptCount: currentInterruptCount,
            maxInterrupts,
            scenarioTitle: currentScenario?.title || "NO SCENARIO",
            judgePersona: currentScenario?.judgePersona || "NO PERSONA",
            isJudgeSpeaking,
            bufferLength: buffer.length,
            difficulty: currentDifficulty
        });

        if (currentInterruptCount >= maxInterrupts) {
            console.log("⏭️ Skip: Already at max interrupts", currentInterruptCount, "/", maxInterrupts);
            return;
        }

        if (!currentScenario) {
            console.error("❌ CRITICAL: No scenario available!", currentScenario);
            return;
        }

        if (isJudgeSpeaking) {
            console.log("⏭️ Skip: Judge is currently speaking");
            return;
        }

        // Get last 1-2 sentences
        const recentText = buffer.slice(-2).join(' ');
        console.log("📝 Recent text to analyze:", recentText);
        
        if (recentText.length < 10) {
            console.log("⏭️ Skip: Text too short (", recentText.length, "chars )");
            return;
        }

        try {
            console.log("🚀 CALLING AI to check interruption with:", {
                text: recentText,
                difficulty: currentDifficulty,
                interruptCount: currentInterruptCount,
                judgePersona: currentScenario.judgePersona
            });
            
            const result = await checkShouldInterrupt(
                recentText,
                currentDifficulty,
                currentInterruptCount,
                currentScenario.judgePersona
            );

            console.log("📊 AI Response:", result);

            if (result.shouldInterrupt && result.question) {
                console.log("⚠️⚠️⚠️ JUDGE WILL INTERRUPT NOW!");
                handleJudgeInterruption(result.question);
            } else {
                console.log("✅ AI decided NOT to interrupt");
            }
        } catch (error) {
            console.error("❌ Interrupt check error:", error);
        }
    };

    const handleJudgeInterruption = useCallback((question: string) => {
        console.log("👨‍⚖️ Judge interrupting with question:", question);
        
        console.log("🛑 Stopping speech recognition for judge...");
        speechService.stopListening();
        
        setIsJudgeSpeaking(true);
        setIsWaitingForClarification(true);
        setInterruptCount(prev => {
            const newCount = prev + 1;
            interruptCountRef.current = newCount;
            console.log("📈 Interrupt count increased to:", newCount);
            return newCount;
        });
        
        // Add judge question to messages
        setMessages(prev => [...prev, { role: 'model', text: question }]);
        
        // Speak the question
        console.log("🔊 Judge speaking question...");
        speechService.speak(question, () => {
            console.log("✅ Judge finished speaking question");
            console.log("🎤 Your turn to respond - restarting speech recognition...");
            setIsJudgeSpeaking(false);
            setTimeout(() => {
                console.log("🎤 ACTUALLY starting speech recognition now...");
                startListeningLoop();
            }, 200);
        });
    }, []);

    const handleClarificationResponse = useCallback(async (userResponse: string) => {
        console.log("💬 User clarification:", userResponse);
        
        const currentScenario = scenarioRef.current;
        const currentDifficulty = difficultyRef.current;
        
        if (!currentScenario) {
            console.error("❌ No scenario for follow-up");
            return;
        }

        console.log("🛑 Stopping speech recognition for AI processing...");
        speechService.stopListening();
        setIsJudgeSpeaking(true);

        try {
            console.log("🤔 Getting judge follow-up...");
            const followUp = await getJudgeFollowUp(
                messages,
                userResponse,
                currentDifficulty,
                currentScenario.judgePersona
            );

            console.log("📊 Follow-up decision:", followUp);
            setMessages(prev => [...prev, { role: 'model', text: followUp.text }]);

            console.log("🔊 Judge speaking follow-up:", followUp.text);
            speechService.speak(followUp.text, () => {
                console.log("✅ Judge finished speaking follow-up");
                setIsJudgeSpeaking(false);
                
                if (followUp.continuePresentation) {
                    console.log("✅ Judge letting student continue presentation");
                    setIsWaitingForClarification(false);
                    setTranscriptBuffer([]);
                    speechCountRef.current = 0;
                    console.log("🎤 Restarting speech recognition for presentation...");
                    setTimeout(() => startListeningLoop(), 200);
                } else {
                    console.log("❓ Judge asking another follow-up question");
                    // Still in clarification mode, but judge already spoke the question
                    console.log("🎤 Restarting speech recognition for clarification answer...");
                    setTimeout(() => startListeningLoop(), 200);
                }
            });
        } catch (error) {
            console.error("❌ Follow-up error:", error);
            setIsWaitingForClarification(false);
            setIsJudgeSpeaking(false);
            console.log("🎤 Error recovery: Restarting speech recognition...");
            setTimeout(() => startListeningLoop(), 200);
        }
    }, [messages]);

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
        isJudgeSpeaking,
        isWaitingForClarification,
        notes,
        setNotes,
        startScenario,
        finishRoleplay,
        skipPreparation,
    };
};
