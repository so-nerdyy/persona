# Persona - AI DECA Roleplay Assistant Setup Guide

## Prerequisites
- Node.js (v20+)
- OpenAI API Key

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd deca-app
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the `deca-app` directory if you need to configure the backend URL:
```
VITE_BACKEND_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## Features

### Scenario Customization
- **Difficulty Levels**: Easy, Medium, Hard
- **Scenario Modes**:
  - **Random**: Generates a completely random scenario
  - **Guided**: Specify a topic or situation (e.g., "social media campaign", "pricing strategy")

### Real-Time Voice Interaction
- Speech-to-text for your responses
- AI judge provides real-time feedback via text-to-speech
- Streaming responses for faster interaction

### Performance Grading
- Scores out of 100
- Detailed feedback
- Specific strengths and weaknesses
- Key takeaway for improvement
- All sessions are automatically saved to the database

### Session Management
- View past roleplay sessions
- Reset session without page reload
- Full transcript storage

## Database

The backend uses SQLite (`roleplays.db`) to store:
- Event type and scenario details
- Full conversation transcript
- Grading results (score, feedback, strengths, weaknesses, key takeaway)
- Difficulty and customization options

## API Endpoints

### AI Services
- `POST /api/ai/scenario` - Generate a new scenario
- `POST /api/ai/chat` - Streaming chat with AI judge
- `POST /api/ai/grade` - Grade a completed roleplay

### Roleplay History
- `GET /api/roleplays` - Fetch all past roleplays
- `POST /api/roleplays` - Save a new roleplay result

## Troubleshooting

### Backend Issues
- Ensure your OpenAI API key is valid and has sufficient credits
- Check that port 3000 is not in use
- Verify the `.env` file is in the `backend` directory

### Frontend Issues
- Make sure the backend is running before starting the frontend
- Check browser console for errors
- Ensure your browser supports Web Speech API (Chrome/Edge recommended)

### Speech Recognition
- Speech recognition requires a secure context (HTTPS or localhost)
- Grant microphone permissions when prompted
- If speech recognition fails, check browser compatibility

