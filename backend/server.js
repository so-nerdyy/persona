const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateScenario,
  chatTurnStream,
  gradeRoleplay,
} = require("./aiService");

// JWT Secret (in production, move to .env)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const db = new Database("roleplays.db");

// Initialize Tables

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Roleplays table
db.exec(`
  CREATE TABLE IF NOT EXISTS roleplays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventType TEXT NOT NULL,
    scenarioTitle TEXT NOT NULL,
    score INTEGER NOT NULL,
    feedback TEXT,
    strengths TEXT, -- JSON string
    weaknesses TEXT, -- JSON string
    transcript TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add new columns if they don't exist (for backward compatibility)
const addColumnIfNotExists = (table, column, type) => {
  try {
    const columnCheck = db.prepare(`PRAGMA table_info(${table})`).all();
    const columnExists = columnCheck.some((col) => col.name === column);
    if (!columnExists) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
      console.log(`Added column ${column} to ${table}`);
    }
  } catch (err) {
    console.error(`Error adding column ${column}:`, err.message);
  }
};

addColumnIfNotExists("roleplays", "difficulty", "TEXT");
addColumnIfNotExists("roleplays", "judgePersona", "TEXT");
addColumnIfNotExists("roleplays", "performanceIndicators", "TEXT");
addColumnIfNotExists("roleplays", "messages", "TEXT");
addColumnIfNotExists("roleplays", "keyTakeaway", "TEXT");
addColumnIfNotExists("roleplays", "topic", "TEXT");
addColumnIfNotExists("roleplays", "mode", "TEXT");
addColumnIfNotExists("roleplays", "userId", "INTEGER");
addColumnIfNotExists("prep_notes", "userId", "INTEGER");

// Create notes table for preparation notes
db.exec(`
  CREATE TABLE IF NOT EXISTS prep_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication Routes

// POST: Register a new user
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters" });
  }

  try {
    // Check if user already exists
    const existingUser = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const info = stmt.run(username, hashedPassword);

    // Generate token
    const token = jwt.sign({ id: info.lastInsertRowid, username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: info.lastInsertRowid, username },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// POST: Login user
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Find user
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// GET: Validate session token
app.get("/api/auth/session", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: { id: req.user.id, username: req.user.username },
  });
});

// AI Routes

// POST: Generate a scenario
app.post("/api/ai/scenario", authenticateToken, async (req, res) => {
  const { eventType, difficulty, topic, mode } = req.body;

  if (!eventType || !difficulty) {
    return res
      .status(400)
      .json({ error: "eventType and difficulty are required" });
  }

  try {
    const scenario = await generateScenario(eventType, difficulty, {
      topic,
      mode,
    });
    res.json(scenario);
  } catch (error) {
    console.error("Error generating scenario:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate scenario" });
  }
});

// POST: Chat turn (streaming)
app.post("/api/ai/chat", authenticateToken, async (req, res) => {
  const { history, currentInput, judgePersona, difficulty } = req.body;

  if (!currentInput || !judgePersona || !difficulty) {
    return res.status(400).json({
      error: "currentInput, judgePersona, and difficulty are required",
    });
  }

  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = chatTurnStream(
      history || [],
      currentInput,
      judgePersona,
      difficulty
    );

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error("Error in chat turn:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: error.message || "Failed to get AI response" });
    }
  }
});

// POST: Grade roleplay
app.post("/api/ai/grade", authenticateToken, async (req, res) => {
  const { transcript, kpis } = req.body;

  if (!transcript || !kpis || !Array.isArray(kpis)) {
    return res
      .status(400)
      .json({ error: "transcript and kpis (array) are required" });
  }

  try {
    const grading = await gradeRoleplay(transcript, kpis);
    res.json(grading);
  } catch (error) {
    console.error("Error grading roleplay:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to grade roleplay" });
  }
});

// Preparation Notes Routes
console.log("Registering notes routes...");

// Test route to verify Express routing works
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route works!" });
});

// GET: Fetch notes for a session
app.get("/api/notes/:sessionId", authenticateToken, (req, res) => {
  console.log(
    "GET /api/notes/:sessionId called with sessionId:",
    req.params.sessionId
  );
  const { sessionId } = req.params;
  const userId = req.user.id;
  try {
    const stmt = db.prepare(
      "SELECT * FROM prep_notes WHERE sessionId = ? AND userId = ? ORDER BY createdAt ASC"
    );
    const notes = stmt.all(sessionId, userId);
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST: Create a new note
app.post("/api/notes", authenticateToken, (req, res) => {
  const { sessionId, title, message } = req.body;
  const userId = req.user.id;

  if (!sessionId || !title || !message) {
    return res
      .status(400)
      .json({ error: "sessionId, title, and message are required" });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO prep_notes (sessionId, title, message, userId)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(sessionId, title, message, userId);
    res.json({ id: info.lastInsertRowid, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// PUT: Update a note
app.put("/api/notes/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;
  const userId = req.user.id;

  if (!title || !message) {
    return res.status(400).json({ error: "title and message are required" });
  }

  try {
    const stmt = db.prepare(`
      UPDATE prep_notes 
      SET title = ?, message = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ? AND userId = ?
    `);
    const info = stmt.run(title, message, id, userId);
    res.json({ success: true, changes: info.changes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// DELETE: Delete a note
app.delete("/api/notes/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const stmt = db.prepare("DELETE FROM prep_notes WHERE id = ? AND userId = ?");
    const info = stmt.run(id, userId);
    res.json({ success: true, changes: info.changes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Roleplay History Routes

// GET: Fetch all past roleplays (filtered by user)
app.get("/api/roleplays", authenticateToken, (req, res) => {
  const userId = req.user.id;
  try {
    const stmt = db.prepare("SELECT * FROM roleplays WHERE userId = ? ORDER BY timestamp DESC");
    const rows = stmt.all(userId);
    // Parse JSON strings back to arrays/objects
    const results = rows.map((row) => ({
      ...row,
      strengths: JSON.parse(row.strengths || "[]"),
      weaknesses: JSON.parse(row.weaknesses || "[]"),
      performanceIndicators: JSON.parse(row.performanceIndicators || "[]"),
      messages: JSON.parse(row.messages || "[]"),
    }));
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch roleplays" });
  }
});

// POST: Save a new roleplay result
app.post("/api/roleplays", authenticateToken, (req, res) => {
  const {
    eventType,
    scenarioTitle,
    score,
    feedback,
    strengths,
    weaknesses,
    transcript,
    difficulty,
    judgePersona,
    performanceIndicators,
    messages,
    keyTakeaway,
    topic,
    mode,
  } = req.body;
  const userId = req.user.id;

  try {
    const stmt = db.prepare(`
      INSERT INTO roleplays (
        eventType, scenarioTitle, score, feedback, strengths, weaknesses, transcript,
        difficulty, judgePersona, performanceIndicators, messages, keyTakeaway, topic, mode, userId
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      eventType,
      scenarioTitle,
      score,
      feedback,
      JSON.stringify(strengths || []),
      JSON.stringify(weaknesses || []),
      transcript,
      difficulty,
      judgePersona,
      JSON.stringify(performanceIndicators || []),
      JSON.stringify(messages || []),
      keyTakeaway,
      topic,
      mode,
      userId
    );

    res.json({ id: info.lastInsertRowid, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save roleplay" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("  GET  /api/notes/:sessionId");
  console.log("  POST /api/notes");
  console.log("  PUT  /api/notes/:id");
  console.log("  DELETE /api/notes/:id");
});
