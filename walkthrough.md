# Persona - Walkthrough

## Overview
The **Persona** is a web application that helps students practice for DECA roleplay events. It uses Google Gemini to generate scenarios, act as a judge, and grade performance.

## Prerequisites
- Node.js installed.
- A Google Gemini API Key (Get one [here](https://aistudio.google.com/)).

## Setup Instructions

1.  **Navigate to the project directory:**
    ```bash
    cd deca-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    - Create a file named `.env` in the `deca-app` folder.
    - Add the following line:
      ```
      VITE_GEMINI_API_KEY=your_actual_api_key_here
      ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## How to Use

1.  **Select an Event**: Choose a category like "Marketing" or "Finance" from the dashboard.
2.  **Read the Scenario**: The AI will generate a unique scenario with a problem to solve and a judge persona.
3.  **Roleplay**:
    - The app listens to your voice automatically.
    - Speak your solution.
    - **Silence Detection**: If you stop talking for 1.5 seconds, the AI will process your input and respond vocally.
    - Have a conversation!
4.  **Finish**: Click "Finish Roleplay" when you are done.
5.  **Get Feedback**: The AI will grade you based on the official Performance Indicators and give you a score out of 100.

## Troubleshooting
- **Microphone not working?** Ensure you've granted browser permission.
- **AI not responding?** Check the console (F12) for API key errors.
- **Voice too robotic?** The app tries to use "Google US English" or "Samantha". You can change this in `src/services/speech.ts`.
