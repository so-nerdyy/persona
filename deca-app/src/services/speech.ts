// Basic type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export class SpeechService {
    private recognition: SpeechRecognition | null = null;
    private synthesis: SpeechSynthesis = window.speechSynthesis;
    private isListening: boolean = false;

    constructor() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            if (this.recognition) {
                this.recognition.continuous = true;
                this.recognition.interimResults = true;
                this.recognition.lang = 'en-US';
            }
        }
    }

    startListening(
        onResult: (text: string, isFinal?: boolean) => void,
        onError: (error: any) => void
    ) {
        if (!this.recognition) {
            console.error("❌ Speech recognition not supported in this browser");
            onError("Speech recognition not supported");
            return;
        }

        if (this.isListening) {
            console.log("⚠️ Already listening, skipping start");
            return;
        }

        console.log("🎤 Starting speech recognition...");

        this.recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript) {
                console.log("✅ Final speech result:", finalTranscript);
                onResult(finalTranscript, true);
            } else if (interimTranscript) {
                console.log("⏳ Interim speech result:", interimTranscript);
                onResult(interimTranscript, false);
            }
        };

        this.recognition.onerror = (event: any) => {
            // Ignore "no-speech" errors as they're expected when user isn't talking
            if (event.error === 'no-speech') {
                console.log("⚪ No speech detected (this is normal)");
                return;
            }
            
            if (event.error === 'aborted') {
                console.log("⚪ Speech recognition aborted (intentional stop)");
                return;
            }
            
            // Log other errors but don't crash
            console.error("❌ Speech recognition error:", event.error);
            
            // Only report actual errors (not no-speech)
            if (event.error !== 'aborted' && event.error !== 'no-speech') {
                onError(event.error);
            }
        };

        this.recognition.onend = () => {
            console.log("🔴 Speech recognition ended");
            // If still marked as listening, it ended unexpectedly, so restart
            if (this.isListening) {
                console.log("🔄 Restarting speech recognition...");
                setTimeout(() => {
                    if (this.isListening) { // Double-check in case it was stopped while waiting
                        this.startListening(onResult, onError);
                    }
                }, 100); // Small delay to prevent rapid restarts
            }
        };

        try {
            this.recognition.start();
            this.isListening = true;
            console.log("✅ Speech recognition started successfully");
        } catch (error) {
            console.error("❌ Failed to start speech recognition:", error);
            onError(error);
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            console.log("🛑 Stopping speech recognition");
            this.recognition.stop();
            this.isListening = false;
        }
    }

    speak(text: string, onEnd?: () => void) {
        this.cancelSpeech(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);

        // Try to select a better voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Get voice speed from localStorage, default to 1.0
        const voiceSpeed = parseFloat(localStorage.getItem('voiceSpeed') || '1.0');
        utterance.rate = voiceSpeed;
        utterance.pitch = 1.0;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        this.synthesis.speak(utterance);
    }

    cancelSpeech() {
        this.synthesis.cancel();
    }
}

export const speechService = new SpeechService();
