# Persona - AI DECA Roleplay Assistant

<div align="center">

![Persona Logo](https://img.shields.io/badge/Persona-AI%20Roleplay-blue?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)

**Master your DECA roleplay skills with AI-powered practice, real-time feedback, and realistic judge interactions**

[Features](#features) • [Getting Started](#getting-started) • [How to Use](#how-to-use) • [Architecture](#architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [How to Use](#how-to-use)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

**Persona** is an AI-powered DECA roleplay practice application that simulates realistic business competition scenarios. It features an intelligent AI judge that:
- Generates custom scenarios based on DECA event categories
- Listens to your presentation and asks clarifying questions
- Interrupts naturally when something is unclear (just like real judges!)
- Provides detailed performance grading with actionable feedback
- Saves your practice history for progress tracking

Perfect for DECA students preparing for competitions!

---

## ✨ Features

### 🔐 **User Authentication**
- Secure login and registration system
- JWT-based session management
- Password encryption with bcrypt
- Personal practice history for each user

### 🎯 **Scenario Customization**
- **Difficulty Levels**: Easy, Medium, Hard
  - Easy: Gentle judge, longer prep time (10 min)
  - Medium: Professional judge, moderate prep (7 min)
  - Hard: Challenging judge, short prep (5 min)
- **Scenario Modes**:
  - **Random**: AI generates completely random scenarios
  - **Guided**: Specify your own topic (e.g., "social media campaign", "pricing strategy")
- Multiple DECA event categories (Marketing, Finance, Hospitality, etc.)

### 📝 **Structured Notes System**
- Create multiple notes with titles and content
- Take notes during preparation phase
- View notes during presentation (collapsible panel)
- Auto-save to local storage
- Add, edit, and delete notes easily

### 🎤 **Real-Time Voice Interaction**
- Browser-based speech recognition (no API needed!)
- Continuous listening during presentation
- Live transcript display
- Text-to-speech for AI judge responses
- Natural voice speed settings

### 👨‍⚖️ **Realistic Judge Interruptions** (NEW!)
- AI judge interrupts naturally when you're unclear
- Uses human-like speech with filler words ("Umm...", "Uh...", "Er...")
- Asks clarification questions just like real DECA judges
- Back-and-forth dialogue for deeper questioning
- Frequency based on difficulty:
  - Easy: 1-3 gentle interruptions
  - Medium: 4-6 professional questions
  - Hard: 7-10 challenging, skeptical interruptions

### ⏱️ **Dynamic Timers**
- Preparation time varies by difficulty (5-10 minutes)
- Presentation timer (10 minutes default)
- Auto-finish when time runs out
- Visual countdown with progress indicators
- Timer runs continuously (realistic!)

### 📊 **Comprehensive Grading**
- AI analyzes your full presentation against DECA Performance Indicators
- Detailed scoring out of 100
- Specific strengths identified
- Areas for improvement highlighted
- Key takeaway for next time
- Full transcript preservation

### 💾 **Practice History**
- All roleplays automatically saved
- View past performances
- Track progress over time
- User-specific history (private to your account)

### 🎨 **Beautiful Glassmorphic UI**
- Modern, responsive design
- Smooth animations with Framer Motion
- Adaptive to all screen sizes (mobile, tablet, desktop)
- Visual state indicators
- Elegant gradient effects

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** v20 or higher ([Download](https://nodejs.org/))
- **OpenAI API Key** with GPT-4o access ([Get one here](https://platform.openai.com/api-keys))
- **Modern browser** (Chrome or Edge recommended for speech features)
- **Microphone** for voice input

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd grizzly-hacks-hackathon
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../deca-app
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd ../backend
```

Add the following to `backend/.env`:

```env
OPENAI_API_KEY=sk-your_actual_openai_api_key_here
JWT_SECRET=your_secret_key_for_jwt_tokens_change_in_production
```

**Important**: 
- Get your OpenAI API key from https://platform.openai.com/api-keys
- Change `JWT_SECRET` to a random string in production
- **Never commit `.env` files to git!**

---

## ▶️ Running the Application

### Terminal 1 - Backend Server

```bash
cd backend
node server.js
```

**Expected Output:**
```
Server running on http://localhost:3000
Available routes:
  GET  /api/notes/:sessionId
  POST /api/notes
  PUT  /api/notes/:id
  DELETE /api/notes/:id
```

### Terminal 2 - Frontend Development Server

```bash
cd deca-app
npm run dev
```

**Expected Output:**
```
VITE v7.2.4  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Open in Browser

Navigate to: **http://localhost:5173**

---

## 🎓 How to Use

### Step 1: Create Account / Login

1. Open http://localhost:5173
2. Click **"Register"** tab
3. Enter username and password (min 4 characters)
4. Click **"Create Account"**

### Step 2: Select Settings

1. **Choose Difficulty**: Easy / Medium / Hard
2. **Select Mode**: Random or Guided
   - **Random**: AI creates surprise scenario
   - **Guided**: Enter your topic (e.g., "customer service complaint")

### Step 3: Pick DECA Event

Click on an event category card:
- Marketing Management
- Business Finance
- Hospitality & Tourism
- And more...

### Step 4: Preparation Phase

- **Review scenario** details and judge persona
- **Take notes** - Click "Add Note" to create multiple notes with titles
- **Watch timer** countdown (5-10 minutes based on difficulty)
- **Click "Begin Now"** when ready, or wait for auto-start

### Step 5: Present Your Roleplay

1. **Judge greets you** - Listen to the introduction
2. **Microphone activates** - Red "RECORDING" indicator shows
3. **Start speaking** - Present your solution
4. **Judge may interrupt**:
   - 🟡 **Yellow** "Judge is Speaking..." → Listen to question
   - 🔵 **Blue** "Respond to Judge" → Answer the clarification
   - 🔴 **Red** "Recording Presentation" → Continue presenting
5. **Timer runs continuously** - Keep track of time
6. **View your notes** - Click notes button (if needed)
7. **Finish** - Click "Finish Roleplay" or wait for timer

### Step 6: Receive Feedback

- **Animated score** reveal out of 100
- **Judge's feedback** - Comprehensive analysis
- **Strengths** - What you did well
- **Areas to Improve** - Specific suggestions
- **Key Takeaway** - Main lesson learned
- **Try Another Scenario** - Practice more!

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Web Speech API (voice)

**Backend:**
- Node.js with Express
- SQLite (database)
- OpenAI GPT-4o (AI judge)
- JWT (authentication)
- bcrypt (password hashing)

### System Flow

```
┌─────────────────────────────────┐
│  User Browser (Frontend)        │
│  http://localhost:5173          │
│                                 │
│  - React UI                     │
│  - Voice Recognition            │
│  - Text-to-Speech               │
└────────────┬────────────────────┘
             │ HTTP/REST API
             │ (JWT Auth)
             ▼
┌─────────────────────────────────┐
│  Express Server (Backend)       │
│  http://localhost:3000          │
│                                 │
│  - API Routes                   │
│  - Authentication               │
│  - Database (SQLite)            │
└────────────┬────────────────────┘
             │ OpenAI SDK
             │ (API Key)
             ▼
┌─────────────────────────────────┐
│  OpenAI GPT-4o                  │
│                                 │
│  - Scenario Generation          │
│  - Judge Interruptions          │
│  - Performance Grading          │
└─────────────────────────────────┘
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/session` | Validate existing session |

### AI Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/scenario` | Generate DECA scenario |
| POST | `/api/ai/chat` | Get AI judge response (streaming) |
| POST | `/api/ai/grade` | Grade roleplay performance |
| POST | `/api/ai/should-interrupt` | Check if judge should interrupt |
| POST | `/api/ai/judge-followup` | Get judge's follow-up question |

### Data Endpoints (Protected, User-Filtered)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roleplays` | Get user's roleplay history |
| POST | `/api/roleplays` | Save roleplay (auto-adds userId) |
| GET | `/api/notes/:sessionId` | Get user's prep notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

---

## 🗄️ Database Schema

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- bcrypt hashed
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### roleplays
```sql
CREATE TABLE roleplays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  eventType TEXT NOT NULL,
  scenarioTitle TEXT NOT NULL,
  score INTEGER NOT NULL,
  feedback TEXT,
  strengths TEXT,  -- JSON array
  weaknesses TEXT,  -- JSON array
  transcript TEXT,
  difficulty TEXT,
  judgePersona TEXT,
  performanceIndicators TEXT,  -- JSON array
  messages TEXT,  -- JSON array
  keyTakeaway TEXT,
  topic TEXT,
  mode TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### prep_notes
```sql
CREATE TABLE prep_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  sessionId TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem**: Server fails to start
```bash
Error: Cannot find module 'openai'
```

**Solution**:
```bash
cd backend
npm install
```

**Problem**: Missing API key error
```bash
Error: OPENAI_API_KEY is not defined
```

**Solution**: Create `backend/.env` with your OpenAI API key:
```env
OPENAI_API_KEY=sk-your_key_here
```

### Frontend Connection Issues

**Problem**: "Failed to generate scenario. Make sure backend is running."

**Solution**:
1. Verify backend is running on port 3000
2. Check terminal output for errors
3. Ensure `.env` file has valid OpenAI API key

**Problem**: CORS errors in browser console

**Solution**: Backend already has CORS enabled. Clear browser cache and refresh.

### Speech Recognition Issues

**Problem**: "Speech recognition not supported"

**Solution**: 
- Use Chrome or Edge browser
- Speech API requires secure context (localhost or HTTPS)

**Problem**: Microphone not working

**Solution**:
1. Grant microphone permissions when prompted
2. Check browser settings → Privacy → Microphone
3. Ensure no other app is using the microphone

**Problem**: Voice not being detected

**Solution**:
- Speak clearly and pause briefly between sentences
- Check browser console (F12) for speech recognition logs
- Look for: `🗣️ Speech received (FINAL): [your text]`

### Judge Not Interrupting

**Problem**: AI judge doesn't ask questions

**Solution**:
- Try being intentionally vague: "We'll use the thing to improve stuff"
- Check console for: `🔍 Time to check for interrupt...`
- Verify backend restarted after adding interruption features
- Try Hard difficulty for more frequent interruptions

### Grading Not Working

**Problem**: No feedback after clicking "Finish Roleplay"

**Solution**:
- Ensure you actually spoke during presentation
- Check console for: `📝 Full transcript: [your text]`
- If transcript is empty, speech wasn't detected
- Verify OpenAI API key has sufficient credits

---

## 🔒 Security

### Best Practices Implemented

✅ **API Key Protection**
- OpenAI API key stored server-side only
- Never exposed to client/browser
- Environment variable configuration

✅ **Authentication**
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Secure session management

✅ **Data Isolation**
- Users can only access their own data
- Server-side filtering by userId
- Protected API endpoints

### Important Security Notes

1. **Never commit `.env` files** - They contain secrets!
2. **Change JWT_SECRET in production** - Use a strong random string
3. **Keep OpenAI API key secure** - Don't share or expose it
4. **Use HTTPS in production** - Encrypt data in transit

---

## 📚 Features Explained

### 1. Guided Scenario Mode

Instead of random scenarios, you can specify exactly what you want to practice:

**Example Topics:**
- "Handling a difficult customer complaint about pricing"
- "Pitching a social media marketing campaign to a skeptical client"
- "Presenting quarterly financial results to investors"
- "Proposing a new employee training program"

The AI will generate a realistic scenario focused on your specific topic.

### 2. Structured Notes

Unlike simple text notes, you can create multiple organized notes:

**Example Note Structure:**
```
Title: "Key Statistics"
Content: 
- Target market: 18-24 year olds
- Budget: $15,000
- Timeline: Q1 2024

Title: "Main Points"
Content:
- Problem: Low brand awareness
- Solution: TikTok influencer campaign
- Expected ROI: 300%
```

### 3. Judge Interruption System

The AI judge realistically interrupts when:
- You use vague terms ("the thing", "various methods")
- You mention numbers without context ("increase by 20%")
- You use jargon without explaining ("CTR", "KPIs")
- Your logic is unclear or incomplete

**Interruption Example:**
```
You: "We'll use the platform to improve our metrics..."

Judge: "Umm, wait - which specific platform are you referring to? 
       And what metrics exactly?"

You: "Instagram for brand awareness, measured by follower growth 
     and engagement rate."

Judge: "Okay, and how will you measure engagement rate specifically?"

You: "Likes, comments, shares, and story views divided by total followers."

Judge: "Alright, I understand. Continue with your presentation."
```

### 4. Dynamic Preparation Time

Based on difficulty, you get different prep times:
- **Easy**: 10 minutes (plenty of time to prepare)
- **Medium**: 7 minutes (moderate pressure)
- **Hard**: 5 minutes (time pressure like real competitions)

The timer, progress bar, and percentage all adapt automatically.

### 5. Comprehensive Grading

After your presentation, the AI judge analyzes:
- **Performance Indicators**: How well you hit each KPI
- **Communication**: Clarity, confidence, professionalism
- **Content**: Depth, specificity, business acumen
- **Responses**: How you handled interruptions

You receive:
- **Score**: 0-100 with visual breakdown
- **Feedback**: 2-3 sentence summary
- **Strengths**: 3 specific things you did well
- **Weaknesses**: 3 areas to improve
- **Key Takeaway**: One main lesson to remember

---

## 🖥️ Running the Application

### Quick Start (First Time)

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Create .env file
echo "OPENAI_API_KEY=sk-your_key_here" > .env
echo "JWT_SECRET=your_secret_key" >> .env

# 3. Start backend (keep terminal open)
node server.js

# 4. In a NEW terminal, install frontend
cd ../deca-app
npm install

# 5. Start frontend (keep terminal open)
npm run dev

# 6. Open browser
# Navigate to http://localhost:5173
```

### Regular Start (After First Time)

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd deca-app
npm run dev
```

**Browser:** http://localhost:5173

---

## 🧪 Testing the Features

### Test Judge Interruptions

**Be Vague:**
```
"We'll improve our metrics using various digital strategies 
 and leverage the platform for better results."
```
→ Judge will interrupt asking for specifics

**Be Clear:**
```
"We'll run Instagram ads targeting users aged 18-24 in Los Angeles, 
 with a $5,000 monthly budget, aiming for 50,000 impressions and 
 1,000 website visits per month."
```
→ Judge likely won't interrupt

### Test Different Difficulties

- **Easy Mode**: Judge is patient, asks gentle questions
- **Medium Mode**: Judge is professional, asks for details
- **Hard Mode**: Judge is skeptical, challenges everything

### Test Notes System

1. During prep phase, click "Add Note"
2. Enter title: "Budget Breakdown"
3. Enter content: "$5K for ads, $3K for influencers"
4. Create multiple notes
5. During presentation, click notes button to view

---

## 📖 Development

### Project Structure

```
grizzly-hacks-hackathon/
├── backend/
│   ├── server.js           # Express server & routes
│   ├── aiService.js        # OpenAI integration
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment variables (create this!)
│   └── roleplays.db       # SQLite database (auto-created)
│
├── deca-app/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── PreparationPhase.tsx
│   │   │   ├── RoleplaySession.tsx
│   │   │   └── FeedbackCard.tsx
│   │   ├── context/        # React context
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/          # Custom hooks
│   │   │   └── useRoleplay.ts
│   │   ├── services/       # API & utilities
│   │   │   ├── ai.ts       # Backend API calls
│   │   │   └── speech.ts   # Speech recognition/synthesis
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json        # Frontend dependencies
│
└── README.md              # This file!
```

### Key Dependencies

**Backend:**
- `express` - Web server
- `cors` - Cross-origin requests
- `better-sqlite3` - Database
- `openai` - AI integration
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication
- `dotenv` - Environment variables

**Frontend:**
- `react` - UI framework
- `framer-motion` - Animations
- `lucide-react` - Icons
- `tailwindcss` - Styling

---

## 🎯 Advanced Features

### Console Logging

Open browser console (F12) to see detailed flow:

```
🎤 Starting speech recognition...
✅ Speech recognition started successfully
🗣️ Speech received (FINAL): Our marketing strategy...
✅ Adding to transcript
🔍 Time to check for interrupt...
⚠️ JUDGE INTERRUPTING!
👨‍⚖️ Judge says: Umm, which specific marketing channels?
💬 User clarification: Instagram and TikTok
✅ Judge letting student continue
🏁 Finishing roleplay...
📊 Total messages: 8
🎯 Calling grading API...
✅ Grading result received
💾 Saving roleplay to backend...
✅ Roleplay saved successfully
```

### Voice Settings

Adjust speech speed in Settings modal:
- Range: 0.5x to 2.0x
- Default: 1.0x (normal speed)
- Saved to localStorage

---

## 🚨 Known Limitations

- Speech recognition only works in Chrome/Edge browsers
- Requires HTTPS or localhost (browser security)
- Microphone permission required
- OpenAI API costs apply (varies by usage)
- Internet connection required

---

## 🎓 Educational Value

### Skills Developed

✅ **Business Communication** - Clear, professional presentation
✅ **Critical Thinking** - Responding to tough questions
✅ **Pressure Management** - Handling interruptions and time limits
✅ **Specificity** - Avoiding vague language
✅ **DECA Performance Indicators** - Meeting competition criteria

### Perfect For

- DECA competition preparation
- Business presentation practice
- Public speaking improvement
- Interview preparation
- Sales pitch training

---

## 🤝 Contributing

This project was built for Grizzly Hacks 2025. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share feedback

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Authors

Built with ❤️ for DECA students

---

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- DECA organization for roleplay format
- Grizzly Hacks 2025 for the opportunity

---

## 📞 Support

Having issues? Check:
1. [Troubleshooting](#troubleshooting) section above
2. Browser console (F12) for error messages
3. Backend terminal for server logs

---

<div align="center">

**🎉 Ready to Master Your DECA Roleplays!**

Start practicing now and ace your next competition!

</div>

