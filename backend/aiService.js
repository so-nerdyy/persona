// roleplay-ai.js
// Rewritten, robust version of your roleplay AI module.
// - Fixes broken history mapping
// - Prevents interruptions on greetings/casual chat
// - Only interrupts when isPresenting is true
// - Includes clear system prompts that include difficulty instructions
// - Safer JSON parsing & fallback defaults
// - Keeps the same exported API you used previously

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helpers
function safeTextFromHistoryItem(h) {
  // Accept multiple possible field names
  if (!h) return "";
  if (typeof h === "string") return h;
  return (h.text || h.content || h.parts || h.message || "").toString();
}

function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to strip markdown fences and retry
    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      throw new Error("Failed to parse JSON from model output: " + e2.message);
    }
  }
}

function isCasualGreeting(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  // common short forms and polite questions
  const greetings = [
    "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
    "how are you", "how's your day", "how is your day", "how've you been",
    "what's up", "whats up", "how are you doing", "how are you?"
  ];
  return greetings.some(g => t.includes(g));
}

function buildDifficultyInstruction(difficulty) {
  return {
    'Easy': 'Be encouraging and guide the student if they are stuck. Keep responses short and friendly.',
    'Medium': 'Be professional. Ask follow-up questions if the student misses a point. Balance critique with helpfulness.',
    'Hard': "Be skeptical. Challenge assumptions. Be concise, direct, and demand specifics. Interrupt when answers are vague (but only during presentations)."
  }[difficulty] || 'Be neutral and professional.';
}

// ------------------------------
// Generate a DECA scenario
// ------------------------------
/**
 * Generate a DECA roleplay scenario
 * @param {string} eventType
 * @param {'Easy'|'Medium'|'Hard'} difficulty
 * @param {object} options
 * @returns {Promise<object>}
 */
async function generateScenario(eventType, difficulty = 'Medium', options = {}) {
  const { topic, mode = 'random' } = options;

  const difficultyPrompt = {
    'Easy': 'The scenario should be straightforward. The judge should be friendly and helpful.',
    'Medium': 'The scenario should have a minor complication. The judge should be professional but neutral.',
    'Hard': 'The scenario should be complex with a difficult conflict or skeptical stakeholder. The judge should be tough and ask hard questions.'
  }[difficulty];

  const topicGuidance = (mode === 'guided' && topic)
    ? `\nThe scenario MUST focus on this specific topic/situation: "${topic}"`
    : '\nGenerate a completely random and creative scenario.';

  const prepTimeMinutes = { 'Easy': 10, 'Medium': 7, 'Hard': 5 }[difficulty] ?? 7;

  const prompt = `Generate a business roleplay scenario for the category: "${eventType}".
Difficulty Level: ${difficulty}
${difficultyPrompt}
${topicGuidance}

Return a JSON object with:
- title: A catchy title.
- description: The scenario description for the student (who they are, who the judge is, what the problem is).
- judgePersona: A brief description of the judge's personality (e.g., "Skeptical Manager", "Enthusiastic Client").
- performanceIndicators: A list of 5 key performance indicators (KPIs) they must hit.
- prepTimeMinutes: Must be the number ${prepTimeMinutes} (just the number, not a string).
- presentationTimeMinutes: Must be the number 10 (just the number, not a string).

Output raw JSON only, no markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a business scenario generator. Always output valid JSON without markdown formatting." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) throw new Error("No content returned from model.");

    const scenario = (typeof text === 'object') ? text : tryParseJSON(text);
    // Validate and supply sensible defaults
    scenario.title = scenario.title || `${eventType} Scenario`;
    scenario.description = scenario.description || "No description provided.";
    scenario.judgePersona = scenario.judgePersona || "Professional Judge";
    scenario.performanceIndicators = Array.isArray(scenario.performanceIndicators) && scenario.performanceIndicators.length >= 1
      ? scenario.performanceIndicators.slice(0, 5)
      : ["Communication", "Problem Analysis", "Recommendations", "Use of Data", "Time Management"];
    scenario.prepTimeMinutes = typeof scenario.prepTimeMinutes === 'number' ? scenario.prepTimeMinutes : prepTimeMinutes;
    scenario.presentationTimeMinutes = typeof scenario.presentationTimeMinutes === 'number' ? scenario.presentationTimeMinutes : 10;

    return scenario;
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw new Error("Failed to generate scenario: " + (error.message || error));
  }
}

// ------------------------------
// Chat turn streaming (judge conversation)
// ------------------------------
/**
 * Get AI response for a chat turn (streaming)
 * @param {Array<{role:string, text?:string, content?:string}>} history
 * @param {string} currentInput
 * @param {string} judgePersona
 * @param {'Easy'|'Medium'|'Hard'} difficulty
 * @param {object} opts - { isPresenting: boolean } (optional)
 * @returns {AsyncGenerator<string>}
 */
async function* chatTurnStream(history = [], currentInput = "", judgePersona = "Judge", difficulty = 'Medium', opts = {}) {
  const { isPresenting = false } = opts;

  const difficultyInstruction = buildDifficultyInstruction(difficulty);

  const systemPrompt = `You are a conversational AI acting as a judge in a business presentation.
Respond naturally and conversationally to all user input, including greetings and personal questions.
Only be critical when evaluating business decisions and only use the strict interruption behavior when the conversation is part of an active presentation (isPresenting = true).

Difficulty instructions:
${difficultyInstruction}

Judge persona: ${judgePersona}
`;

  const messages = [
    { role: "system", content: systemPrompt },
    // Normalize history safely
    ...history.map(h => ({
      role: (h.role === 'user' || h.role === 'student') ? 'user' : 'assistant',
      content: safeTextFromHistoryItem(h)
    })),
    { role: "user", content: currentInput }
  ];

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
      // We don't force response_format for chat streaming; we'll stream raw text.
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (!delta) continue;
      // Very small safety: if the model tries to run interruption logic for casual greeting while not presenting,
      // we let it be conversational. The system prompt above should already enforce this.
      yield delta;
    }
  } catch (error) {
    console.error("Error in chat turn stream:", error);
    // Yield an error message once then stop
    yield `\n[System] Error generating response: ${error.message || error}\n`;
    return;
  }
}

// ------------------------------
// Grading a roleplay session
// ------------------------------
/**
 * Grade a roleplay session
 * @param {string} transcript
 * @param {Array<string>} kpis
 * @returns {Promise<object>}
 */
async function gradeRoleplay(transcript = "", kpis = []) {
  const prompt = `Grade this business roleplay based on the following Performance Indicators:
${JSON.stringify(kpis)}

Transcript:
"${transcript}"

Return a JSON object with:
- score: A number out of 100. Be fair but critical.
- feedback: A summary of feedback (2-3 sentences).
- strengths: List of 3 specific strengths shown in the transcript.
- weaknesses: List of 3 specific areas for improvement.
- keyTakeaway: One main thing the student should remember for next time.

Output raw JSON only.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a business judge providing constructive feedback. Always output valid JSON without markdown formatting." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) throw new Error("No grading content returned from model.");
    const result = (typeof text === "object") ? text : tryParseJSON(text);
    // Basic normalization
    result.score = Number(result.score) || 0;
    result.feedback = result.feedback || "";
    result.strengths = Array.isArray(result.strengths) ? result.strengths.slice(0, 3) : [];
    result.weaknesses = Array.isArray(result.weaknesses) ? result.weaknesses.slice(0, 3) : [];
    result.keyTakeaway = result.keyTakeaway || "";
    return result;
  } catch (error) {
    console.error("Error grading roleplay:", error);
    throw new Error("Failed to grade roleplay: " + (error.message || error));
  }
}

// ------------------------------
// Determine if judge should interrupt
// ------------------------------
/**
 * Determine if judge should interrupt the student.
 * NOTE: This function will early-return false for casual greetings or when isPresenting is false.
 *
 * @param {object} params
 *  - recentTranscript: string
 *  - difficulty: 'Easy'|'Medium'|'Hard'
 *  - interruptCount: number
 *  - judgePersona: string
 *  - isPresenting: boolean  <-- REQUIRED: only interrupt if true
 * @returns {Promise<{shouldInterrupt: boolean, question?: string}>}
 */
async function shouldInterruptPresentation(params = {}) {
  const {
    recentTranscript = "",
    difficulty = 'Medium',
    interruptCount = 0,
    judgePersona = "Judge",
    isPresenting = false
  } = params;

  // If not presenting, do NOT interrupt for chit-chat or greetings.
  if (!isPresenting) {
    return { shouldInterrupt: false };
  }

  // Ignore trivial/short messages
  if (!recentTranscript || recentTranscript.trim().length < 15) {
    return { shouldInterrupt: false };
  }

  // Ignore casual greetings explicitly
  if (isCasualGreeting(recentTranscript)) {
    return { shouldInterrupt: false };
  }

  const maxInterrupts = { 'Easy': 3, 'Medium': 6, 'Hard': 10 }[difficulty] ?? 6;
  if (interruptCount >= maxInterrupts) {
    return { shouldInterrupt: false };
  }

  const interruptionGuidance = {
    'Easy': 'Interrupt if anything is unclear or vague. Be encouraging and curious.',
    'Medium': 'Interrupt frequently when specificity is lacking. Be firm but professional.',
    'Hard': 'Interrupt often for vagueness or unsupported claims. Be skeptical and demand specifics.'
  }[difficulty];

  const prompt = `You are the judge: ${judgePersona}.
Difficulty: ${difficulty}
${interruptionGuidance}

The student just said:
"${recentTranscript}"

Current interrupts: ${interruptCount}/${maxInterrupts}

INTERRUPT if the student:
- Uses vague terms ("thing", "stuff", "various", "improve")
- Mentions numbers without context
- Makes claims without evidence
- Uses jargon without explanation
- Is unclear about key points

If interrupting, produce a short, natural interruption that starts with filler words like "Umm," "Uh," "Er," "So," or "Like," and asks a concise clarifying question.

Return JSON:
{ "shouldInterrupt": true/false, "question": "the natural interruption if true" }
Output raw JSON only.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a strict judge who interrupts to ensure clarity. Always output valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) return { shouldInterrupt: false };
    const result = (typeof text === "object") ? text : tryParseJSON(text);
    // Ensure boolean
    result.shouldInterrupt = !!result.shouldInterrupt;
    result.question = result.question || "";
    return result;
  } catch (error) {
    console.error("Error checking interruption:", error);
    // Fail-safe: don't interrupt if model errors
    return { shouldInterrupt: false };
  }
}

// ------------------------------
// Generate judge follow-up after user responds
// ------------------------------
/**
 * Generate judge's follow-up after student responds
 * @param {Array<{role:string, text?:string}>} conversationHistory
 * @param {string} userResponse
 * @param {'Easy'|'Medium'|'Hard'} difficulty
 * @param {string} judgePersona
 * @param {object} opts - { isPresenting: boolean }
 * @returns {Promise<{continuePresentation: boolean, text: string}>}
 */
async function generateJudgeFollowUp(conversationHistory = [], userResponse = "", difficulty = 'Medium', judgePersona = "Judge", opts = {}) {
  const { isPresenting = false } = opts;

  // If not presenting, default to conversational continuation
  if (!isPresenting) {
    return { continuePresentation: true, text: "Alright, go on." };
  }

  const followUpGuidance = {
    'Easy': 'If answer is decent, let them continue with an encouraging phrase. If still unclear, ask ONE more question. 40% chance to ask follow-up.',
    'Medium': 'Ask follow-up 60% of the time even if answer was okay. If unclear, definitely ask again.',
    'Hard': 'Ask follow-up 80% of the time. Challenge their answer. Only let them continue if answer was exceptional.'
  }[difficulty];

  const recentMessages = conversationHistory.slice(-6).map(m => `${m.role === 'user' ? 'Student' : 'Judge'}: ${safeTextFromHistoryItem(m)}`).join('\n');

  const prompt = `You are the judge: ${judgePersona}.
Difficulty: ${difficulty}
${followUpGuidance}

Recent conversation:
${recentMessages}

Student just responded: "${userResponse}"

Should you:
A) Let them continue (short encouraging phrase)
B) Ask a follow-up question (needs more detail)

Return JSON:
{
  "continuePresentation": true/false,
  "text": "your natural response (short)"
}
Output raw JSON only.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a demanding judge. Use natural human speech with filler words. Always output valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.75,
      response_format: { type: "json_object" }
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) return { continuePresentation: true, text: "Umm, okay, continue." };
    const result = (typeof text === "object") ? text : tryParseJSON(text);
    result.continuePresentation = !!result.continuePresentation;
    result.text = result.text || (result.continuePresentation ? "Alright, go on" : "Uh, could you be more specific about that?");
    return result;
  } catch (error) {
    console.error("Error generating follow-up:", error);
    // Fail-safe: continue
    return { continuePresentation: true, text: "Umm, okay, continue." };
  }
}

// Export the module API (keeps same function names you used)
module.exports = {
  generateScenario,
  chatTurnStream,
  gradeRoleplay,
  shouldInterruptPresentation,
  generateJudgeFollowUp
};
