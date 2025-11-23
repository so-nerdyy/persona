# Persona

Persona is a web application that simulates DECA roleplay events using AI.

## Features
- **Scenario Generation**: Creates unique roleplay scenarios based on event type.
- **Voice Interaction**: Speak to the AI Judge, and it speaks back.
- **Real-time Feedback**: Get graded on official DECA Performance Indicators.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   - Copy `.env.example` to `.env`
   - Get an API key from [OpenAI](https://platform.openai.com/api-keys)
   - Paste it into `.env` as `VITE_OPENAI_API_KEY=your_key_here`

3. **Run Locally**
   ```bash
   npm run dev
   ```

## Tech Stack
- React + Vite
- Tailwind CSS
- OpenAI API (GPT-4o)
- Web Speech API
