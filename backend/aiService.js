const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a DECA roleplay scenario using GPT-4o
 * @param {string} eventType - The DECA event category
 * @param {'Easy' | 'Medium' | 'Hard'} difficulty - Difficulty level
 * @param {object} options - Additional options (topic, mode)
 * @returns {Promise<object>} RoleplayScenario object
 */
async function generateScenario(eventType, difficulty, options = {}) {
    const { topic, mode = 'random' } = options;

    const difficultyPrompt = {
        'Easy': 'The scenario should be straightforward. The judge should be friendly and helpful.',
        'Medium': 'The scenario should have a minor complication. The judge should be professional but neutral.',
        'Hard': 'The scenario should be complex with a difficult conflict or skeptical stakeholder. The judge should be tough, skeptical, and ask hard questions.'
    }[difficulty];

    let topicGuidance = '';
    if (mode === 'guided' && topic) {
        topicGuidance = `\nThe scenario MUST focus on this specific topic/situation: "${topic}"`;
    } else if (mode === 'random') {
        topicGuidance = '\nGenerate a completely random and creative scenario.';
    }

    const prepTimeMinutes = {
        'Easy': 10,
        'Medium': 7,
        'Hard': 5
    }[difficulty];

    const prompt = `Generate a DECA roleplay scenario for the event category: "${eventType}".
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
                {
                    role: "system",
                    content: "You are a DECA competition scenario generator. Always output valid JSON without markdown formatting."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const scenario = JSON.parse(cleanText);
        
        // Ensure time fields are present and are numbers
        if (!scenario.prepTimeMinutes || typeof scenario.prepTimeMinutes !== 'number') {
            scenario.prepTimeMinutes = prepTimeMinutes;
        }
        if (!scenario.presentationTimeMinutes || typeof scenario.presentationTimeMinutes !== 'number') {
            scenario.presentationTimeMinutes = 10;
        }
        
        return scenario;
    } catch (error) {
        console.error("Error generating scenario:", error);
        throw new Error("Failed to generate scenario: " + error.message);
    }
}

/**
 * Get AI response for a chat turn (streaming support)
 * @param {Array} history - Chat history
 * @param {string} currentInput - Current user input
 * @param {string} judgePersona - Judge's persona
 * @param {'Easy' | 'Medium' | 'Hard'} difficulty - Difficulty level
 * @returns {AsyncGenerator<string>} Stream of response chunks
 */
async function* chatTurnStream(history, currentInput, judgePersona, difficulty) {
    const difficultyInstruction = {
        'Easy': 'Be encouraging and guide the student if they are stuck. Keep responses short.',
        'Medium': 'Be professional. Ask follow-up questions if the student misses a point.',
        'Hard': 'Be skeptical. Challenge the student\'s assumptions. Interrupt if they ramble (simulate this by being concise and direct).'
    }[difficulty];

    const systemPrompt = `You are acting as a DECA Judge. Your persona is: ${judgePersona}. 
Difficulty Level: ${difficulty}.
${difficultyInstruction}

Keep your responses concise (under 2 sentences) and conversational. 
Do not break character. Do not give feedback yet.`;

    const messages = [
        {
            role: "system",
            content: systemPrompt
        },
        ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.parts
        })),
        {
            role: "user",
            content: currentInput
        }
    ];

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            temperature: 0.7,
            max_tokens: 150,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }
        }
    } catch (error) {
        console.error("Error in chat turn:", error);
        throw new Error("Failed to get AI response: " + error.message);
    }
}

/**
 * Grade a roleplay session
 * @param {string} transcript - Full conversation transcript
 * @param {Array<string>} kpis - Performance indicators to grade against
 * @returns {Promise<object>} Grading result
 */
async function gradeRoleplay(transcript, kpis) {
    const prompt = `Grade this DECA roleplay based on the following Performance Indicators:
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
                {
                    role: "system",
                    content: "You are a DECA competition judge providing constructive feedback. Always output valid JSON without markdown formatting."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error grading roleplay:", error);
        throw new Error("Failed to grade roleplay: " + error.message);
    }
}

/**
 * Determine if judge should interrupt (STRICT MODE - interrupts frequently)
 * @param {string} recentTranscript - Last 1-2 sentences from user
 * @param {'Easy' | 'Medium' | 'Hard'} difficulty
 * @param {number} interruptCount - Current interrupt count
 * @param {string} judgePersona
 * @returns {Promise<object>} { shouldInterrupt: boolean, question?: string }
 */
async function shouldInterruptPresentation(recentTranscript, difficulty, interruptCount, judgePersona) {
    const maxInterrupts = {
        'Easy': 3,
        'Medium': 6,
        'Hard': 10
    }[difficulty];

    // Stop if at max
    if (interruptCount >= maxInterrupts) {
        return { shouldInterrupt: false };
    }

    // Don't analyze very short transcripts
    if (!recentTranscript || recentTranscript.trim().length < 15) {
        return { shouldInterrupt: false };
    }

    const interruptionGuidance = {
        'Easy': 'Interrupt if ANYTHING is even slightly unclear, vague, or could use more detail. Be encouraging but inquisitive. Use 50% chance of adding filler words like "umm", "uh", "like".',
        'Medium': 'Interrupt FREQUENTLY when anything is vague, uses unclear terms, or lacks specifics. Be direct. Use 70% chance of filler words.',
        'Hard': 'Interrupt VERY OFTEN - even for minor vagueness. Be skeptical and demanding. Challenge almost everything. Use 80% chance of filler words like "umm", "uh", "er".'
    }[difficulty];

    const prompt = `You are a DECA judge: ${judgePersona}.
Difficulty: ${difficulty} - BE VERY STRICT AND INTERRUPT FREQUENTLY

${interruptionGuidance}

The student just said:
"${recentTranscript}"

Current interrupts: ${interruptCount}/${maxInterrupts}

INTERRUPT if the student:
- Uses ANY vague terms ("thing", "stuff", "various", "improve")
- Mentions ANY number without context
- Makes ANY claim without specific backing
- Uses jargon/acronyms without explaining
- Is even SLIGHTLY unclear about anything
- Could be more specific about ANYTHING

You should interrupt about 60-80% of the time (be strict!).

If interrupting, use NATURAL human speech with filler words:
- Start with "Umm,", "Uh,", "Er,", "Like,", "So,"
- Mix in "wait", "hold on", "sorry", "excuse me"
- Sound human and spontaneous

Examples:
- "Umm, wait - what specific metrics are you talking about?"
- "Uh, hold on, could you be more specific about that strategy?"
- "Er, sorry, but I'm not clear on what you mean by 'the platform'?"
- "Like, what exactly do you mean by 'improve engagement'?"

Return JSON:
{
  "shouldInterrupt": true/false,
  "question": "your natural interruption with filler words"
}

BE STRICT - if there's even a hint of vagueness, interrupt!`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a strict DECA judge who interrupts frequently to ensure clarity. Use natural human speech with filler words. Always output valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.9, // Higher temperature for more varied responses
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;
        const result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
        console.log("Interrupt decision:", result);
        return result;
    } catch (error) {
        console.error("Error checking interruption:", error);
        return { shouldInterrupt: false };
    }
}

/**
 * Generate judge's follow-up after student responds
 * @param {Array} conversationHistory - Recent messages
 * @param {string} userResponse - User's clarification response
 * @param {'Easy' | 'Medium' | 'Hard'} difficulty
 * @param {string} judgePersona
 * @returns {Promise<object>} { continuePresentation: boolean, text: string }
 */
async function generateJudgeFollowUp(conversationHistory, userResponse, difficulty, judgePersona) {
    const followUpGuidance = {
        'Easy': 'If answer is decent, let them continue with encouraging phrase. If still unclear, ask ONE more question. 40% chance to ask follow-up.',
        'Medium': 'Be demanding - ask follow-up 60% of the time even if answer was okay. If unclear, definitely ask again.',
        'Hard': 'Be very demanding - ask follow-up 80% of the time. Challenge their answer. Only let them continue if answer was exceptional.'
    }[difficulty];

    const recentMessages = conversationHistory.slice(-6).map(m => 
        `${m.role === 'user' ? 'Student' : 'Judge'}: ${m.text}`
    ).join('\n');

    const prompt = `You are a DECA judge: ${judgePersona}.
Difficulty: ${difficulty}
${followUpGuidance}

Recent conversation:
${recentMessages}

Student just responded: "${userResponse}"

Should you:
A) Let them continue (say something short like "Okay, continue" or "Alright, go on")
B) Ask a follow-up question (because their answer needs more detail)

Use natural speech with filler words (umm, uh, like, so).

Return JSON:
{
  "continuePresentation": true/false,
  "text": "your response with natural speech"
}

Examples if continuing:
- "Umm, okay, continue"
- "Alright, I see. Go on"
- "Uh, that makes sense. Continue"

Examples if asking more:
- "Uh, but HOW exactly will that work?"
- "Umm, okay but what about [specific concern]?"
- "Er, I'm still not clear on [specific point]"`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a demanding DECA judge. Use natural human speech with filler words. Always output valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.8,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0].message.content;
        const result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
        return result;
    } catch (error) {
        console.error("Error generating follow-up:", error);
        return { continuePresentation: true, text: "Umm, okay, continue." };
    }
}

module.exports = {
    generateScenario,
    chatTurnStream,
    gradeRoleplay,
    shouldInterruptPresentation,
    generateJudgeFollowUp
};

