# Implementation Plan - Persona

## Goal
Build a web application that simulates DECA roleplay events. The app will act as a "Judge", providing a scenario, listening to the student's response, conversing in character, and grading them based on official DECA Performance Indicators.

## User Review Required
> [!IMPORTANT]
> **AI Provider**: I plan to use **Google Gemini Flash** (via API) because it's fast, cheap, and has a large context window for handling the roleplay instructions. Let me know if you prefer OpenAI.

> [!NOTE]
> **Voice Tech**: To keep it simple and fast for the hackathon, I will use the browser's native **Web Speech API** for Speech-to-Text (STT) and Text-to-Speech (TTS). This avoids extra API costs/latency.

## Proposed Architecture

### Tech Stack
- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS (Custom "Glassmorphism" theme)
- **State Management**: Zustand (for simple global state like "Current Event")
- **AI**: Google Gemini API (via `google-generative-ai` SDK)
- **Audio**: Native Web Audio API + MediaRecorder

### Component Structure
#### [NEW] `src/`
- `components/`
    - `RoleplaySession.tsx`: The main game loop (Mic button, Live Transcript, AI Response).
    - `EventSelector.tsx`: Grid of cards to choose the event (Marketing, Finance, etc.).
    - `FeedbackCard.tsx`: Displays the final score and tips.
    - `AudioVisualizer.tsx`: Cool animation when the user is talking.
- `services/`
    - `ai.ts`: Handles calls to Gemini (Generate Scenario, Chat, Grade).
    - `speech.ts`: Wrapper around `window.SpeechRecognition` and `window.speechSynthesis`.
- `hooks/`
    - `useRoleplay.ts`: Manages the state of the current session.

## Data Flow
1. **Selection**: User picks "Sports Marketing".
2. **Init**: AI generates a scenario (e.g., "Sell a sponsorship package").
3. **Loop**:
    - User speaks -> STT converts to text.
    - Text sent to AI -> AI generates response text.
    - AI response -> TTS speaks it back.
4. **Conclusion**: User clicks "Finish Roleplay".
5. **Grading**: AI analyzes the entire transcript against KPIs and returns a JSON score.

## Verification Plan
### Automated Tests
- N/A (Hackathon speed - manual testing only).

### Manual Verification
- **Scenario Test**: Verify the AI generates a coherent DECA prompt.
- **Voice Test**: Verify the browser can hear me and transcribe accurately.
- **Grading Test**: Intentionally do a "bad" job and see if the AI gives a low score.
