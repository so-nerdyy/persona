# Quick Start Guide

## 1. Get Your OpenAI API Key
Visit https://platform.openai.com/api-keys and create an API key.

## 2. Backend Setup (Terminal 1)
```bash
cd backend
npm install
echo "OPENAI_API_KEY=your_actual_key_here" > .env
node server.js
```

You should see: `Server running on http://localhost:3000`

## 3. Frontend Setup (Terminal 2)
```bash
cd deca-app
npm install
npm run dev
```

You should see: `Local: http://localhost:5173/`

## 4. Open in Browser
Navigate to http://localhost:5173

## 5. Use the App
1. Select difficulty (Easy/Medium/Hard)
2. Choose scenario mode (Random or Guided)
   - For Guided: enter a topic like "pricing strategy"
3. Click on an event category (e.g., Marketing Management)
4. Wait for scenario generation
5. **Allow microphone access** when prompted
6. Start speaking when you see "Listening"
7. The AI judge will respond (you'll hear it speak)
8. Click "Finish Roleplay" when done
9. View your score, feedback, strengths, weaknesses, and key takeaway!

## Troubleshooting
- **Backend won't start**: Check your OPENAI_API_KEY in .env
- **Frontend can't connect**: Make sure backend is running on port 3000
- **No microphone**: Grant permissions in browser settings
- **Speech not working**: Use Chrome or Edge browser

## Need More Details?
See SETUP.md for comprehensive documentation.

