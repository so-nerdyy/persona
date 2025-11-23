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
  private restartTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";
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
      console.log("⚠️ Already listening, stopping first then restarting...");
      this.recognition.stop();
      this.isListening = false;
      // Wait a bit then restart
      setTimeout(() => this.startListening(onResult, onError), 150);
      return;
    }

    console.log("🎤 Starting speech recognition...");

    this.recognition.onresult = (event: any) => {
      console.log(
        "📢 Speech result event received, resultIndex:",
        event.resultIndex,
        "results length:",
        event.results.length
      );

      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
          console.log("✅ Final result [" + i + "]:", transcript);
        } else {
          interimTranscript += transcript;
          console.log("⏳ Interim result [" + i + "]:", transcript);
        }
      }

      if (finalTranscript) {
        console.log("✅ Calling onResult with FINAL:", finalTranscript);
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        console.log("⏳ Calling onResult with INTERIM:", interimTranscript);
        onResult(interimTranscript, false);
      } else {
        console.log("⚠️ No transcript in result event");
      }
    };

    this.recognition.onerror = (event: any) => {
      // Ignore "no-speech" errors as they're expected when user isn't talking
      if (event.error === "no-speech") {
        console.log("⚪ No speech detected (this is normal)");
        return;
      }

      if (event.error === "aborted") {
        console.log("⚪ Speech recognition aborted (intentional stop)");
        return;
      }

      // Log other errors but don't crash
      console.error("❌ Speech recognition error:", event.error);

      // Only report actual errors (not no-speech)
      if (event.error !== "aborted" && event.error !== "no-speech") {
        onError(event.error);
      }
    };

    this.recognition.onend = () => {
      console.log("🔴 Speech recognition ended");

      // Clear any existing restart timeout
      if (this.restartTimeoutId) {
        clearTimeout(this.restartTimeoutId);
        this.restartTimeoutId = null;
      }

      // Capture the current listening state
      const wasListening = this.isListening;

      // Only restart if we were actually listening when it ended unexpectedly
      if (wasListening) {
        console.log(
          "🔄 Scheduling potential restart (checking again after delay)..."
        );

        // Store timeout ID so we can cancel it if stopListening() is called
        this.restartTimeoutId = setTimeout(() => {
          // Clear the timeout ID
          this.restartTimeoutId = null;

          // Double-check: Only restart if still supposed to be listening
          // This prevents restarting if stopListening() was called during the delay
          if (!this.isListening) {
            console.log(
              "⏭️ Skipping restart - listening was stopped explicitly"
            );
            return;
          }

          // If we get here, it ended unexpectedly and no one stopped it
          console.log("🔄 Restarting speech recognition (unexpected end)...");
          // Mark as not listening before attempting restart
          this.isListening = false;
          this.startListening(onResult, onError);
        }, 100); // Small delay to prevent rapid restarts
      } else {
        console.log(
          "⚪ Speech recognition ended as expected (was already stopped)"
        );
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
      console.log("✅ Speech recognition started successfully");
    } catch (error) {
      console.error("❌ Failed to start speech recognition:", error);
      this.isListening = false;
      onError(error);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      console.log("🛑 Stopping speech recognition");
      this.recognition.stop();
      this.isListening = false;
    }

    // Cancel any pending restart timeout to prevent race condition
    if (this.restartTimeoutId) {
      console.log("🚫 Cancelling pending restart timeout");
      clearTimeout(this.restartTimeoutId);
      this.restartTimeoutId = null;
    }
  }

  speak(text: string, onEnd?: () => void) {
    this.cancelSpeech(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to select a better voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes("Google US English") || v.name.includes("Samantha")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Get voice speed from localStorage, default to 1.0
    const voiceSpeed = parseFloat(localStorage.getItem("voiceSpeed") || "1.0");
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
