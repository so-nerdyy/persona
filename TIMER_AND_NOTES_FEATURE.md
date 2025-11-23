# Timer and Preparation Notes Feature

## Overview
Added realistic DECA competition features including preparation time, presentation time limits, and a notes system for organizing thoughts before presenting.

## New Features

### 1. Preparation Phase with Timer
- **Automatic Timer**: AI generates appropriate prep time based on difficulty:
  - **Easy**: 10 minutes
  - **Medium**: 7 minutes
  - **Hard**: 5 minutes
- **Visual Countdown**: Large, clear timer display
- **Time Warnings**: Timer turns red and pulses when under 60 seconds
- **Auto-Transition**: When time expires, prompts user to start presentation
- **Skip Option**: Can skip preparation and start immediately

### 2. Preparation Notes System
- **Create Notes**: Add titled notes with detailed content during prep time
- **Edit Notes**: Modify existing notes on the fly
- **Delete Notes**: Remove notes you don't need
- **Persistent Storage**: Notes are saved to the database per session
- **Available During Presentation**: Access your notes while presenting

### 3. Presentation Timer
- **Fixed Duration**: 10 minutes for all presentations (standard DECA time)
- **Always Visible**: Timer bar at top of roleplay screen
- **Warning System**: Red/pulsing when under 60 seconds
- **Time's Up Alert**: Clear indication when presentation time expires

### 4. Notes During Presentation
- **Collapsible Panel**: Show/hide notes without disrupting conversation
- **Quick Access**: Click "Show Notes" to view all preparation notes
- **Read-Only**: Notes are displayed for reference, not editable during presentation
- **Compact View**: Optimized layout to not obstruct the conversation

## Database Changes

### New Table: `prep_notes`
```sql
CREATE TABLE prep_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sessionId TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Updated Scenario Schema
Scenarios now include:
- `prepTimeMinutes`: Preparation time in minutes
- `presentationTimeMinutes`: Presentation time (always 10)

## API Endpoints

### Notes CRUD
- `GET /api/notes/:sessionId` - Fetch all notes for a session
- `POST /api/notes` - Create a new note
  - Body: `{ sessionId, title, message }`
- `PUT /api/notes/:id` - Update a note
  - Body: `{ title, message }`
- `DELETE /api/notes/:id` - Delete a note

## User Flow

### 1. Scenario Generation
1. User selects event, difficulty, and customization
2. Click event category to generate scenario
3. AI generates scenario with appropriate prep time

### 2. Preparation Phase
1. Timer starts automatically (5-10 min based on difficulty)
2. User reviews scenario and performance indicators
3. User can add/edit/delete notes:
   - Click "Add Note"
   - Enter title and content
   - Save or cancel
4. Option to skip prep and start immediately
5. When timer expires, "Start Presentation" button appears

### 3. Presentation Phase
1. Presentation timer starts (10 minutes)
2. Timer visible at top of screen
3. Notes accessible via "Show Notes" button
4. Microphone active for voice interaction
5. AI judge responds in real-time
6. User can finish early or wait for time to expire

### 4. Post-Presentation
1. Click "Finish Roleplay"
2. Receive grading and feedback
3. Notes are saved with the session

## UI/UX Highlights

### Preparation Phase
- **Large Timer Display**: Easy to see at a glance
- **Color-Coded Warnings**: Blue → Red when time is low
- **Pulsing Animation**: Draws attention to expiring timer
- **Card-Based Notes**: Clean, organized note interface
- **Inline Editing**: Edit notes without modal dialogs

### Presentation Phase
- **Compact Timer Bar**: Doesn't obstruct conversation
- **Badge Indicator**: Shows note count
- **Smooth Transitions**: AnimatePresence for show/hide
- **Scrollable Notes Panel**: Handles many notes gracefully

## Technical Implementation

### Backend (`aiService.js`)
- Modified scenario generation prompt to include timing
- GPT-4o returns `prepTimeMinutes` and `presentationTimeMinutes`

### Backend (`server.js`)
- Created `prep_notes` table
- Added 4 RESTful routes for notes CRUD
- All notes operations use `sessionId` for isolation

### Frontend (`ai.ts`)
- Added `PrepNote` TypeScript interface
- Created 4 API functions: `fetchNotes`, `createNote`, `updateNote`, `deleteNote`
- Extended `RoleplayScenario` interface with time fields

### Frontend (`useRoleplay.ts`)
- Added `PREPARING` game state
- Added `sessionId` (unique per session)
- Added timer states: `prepTimeRemaining`, `presentationTimeRemaining`
- Implemented timer countdown logic with refs
- Added functions: `startPrepTimer`, `startPresentationTimer`, `startPresentation`, `skipPreparation`
- Timers cleanup on unmount

### Frontend Components
- **`PreparationPhase.tsx`**: New component for prep screen
  - Timer display
  - Scenario review
  - Notes CRUD interface
  - Start/skip buttons
- **`RoleplaySession.tsx`**: Updated with:
  - Presentation timer bar
  - Notes panel (collapsible)
  - Time warning indicators
- **`App.tsx`**: Added prep phase in render logic

## Benefits

### Educational Value
- **Realistic Practice**: Mimics actual DECA competition format
- **Time Management**: Students learn to pace themselves
- **Organization**: Encourages structured thinking

### User Experience
- **Less Pressure**: Dedicated prep time reduces anxiety
- **Better Performance**: Notes help recall key points
- **Flexibility**: Can skip prep if already prepared

### Technical Quality
- **Clean Architecture**: Separation of prep/present phases
- **Persistent Data**: Notes saved for later review
- **Responsive UI**: Timers update smoothly without lag

## Future Enhancements
- Export notes as PDF
- Timer pause/resume
- Custom time limits
- Audio alerts when time is low
- Practice mode (no timer)
- View past session notes in history

