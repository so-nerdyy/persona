// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Get auth token helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface RoleplayScenario {
  title: string;
  description: string;
  judgePersona: string;
  performanceIndicators: string[];
  prepTimeMinutes?: number;
  presentationTimeMinutes?: number;
}

export interface GradeResult {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  keyTakeaway: string;
}

/**
 * Generate a DECA roleplay scenario by calling the backend API
 */
export const generateScenario = async (
  eventType: string,
  difficulty: Difficulty,
  options?: { topic?: string; mode?: string }
): Promise<RoleplayScenario> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/scenario`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        eventType,
        difficulty,
        topic: options?.topic,
        mode: options?.mode || 'random',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to generate scenario' }));
      throw new Error(error.error || 'Failed to generate scenario');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw error;
  }
};

/**
 * Get AI response for a chat turn (supports streaming from backend)
 */
export const getAIResponse = async (
  history: { role: "user" | "model"; parts: string }[],
  judgePersona: string,
  difficulty: Difficulty
): Promise<string> => {
  try {
    // Separate the current input (last message) from the history
    const currentInput = history[history.length - 1]?.parts || '';
    const previousHistory = history.slice(0, -1);

    console.log("📤 Sending to AI:", {
      historyLength: previousHistory.length,
      currentInput,
      judgePersona,
      difficulty
    });

    const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        history: previousHistory,
        currentInput,
        judgePersona,
        difficulty,
      }),
    });

    console.log("📥 AI Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to get AI response' }));
      console.error("❌ AI Response error:", error);
      throw new Error(error.error || 'Failed to get AI response');
    }

    // For now, read the full response (streaming can be added later)
    const text = await response.text();
    console.log("✅ AI Response text:", text);
    return text;
  } catch (error) {
    console.error("❌ Error getting AI response:", error);
    throw error;
  }
};

/**
 * Get AI response with streaming support
 */
export const getAIResponseStream = async (
  history: { role: "user" | "model"; parts: string }[],
  judgePersona: string,
  difficulty: Difficulty,
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    // Separate the current input (last message) from the history
    const currentInput = history[history.length - 1]?.parts || '';
    const previousHistory = history.slice(0, -1);

    const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        history: previousHistory,
        currentInput,
        judgePersona,
        difficulty,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to get AI response' }));
      throw new Error(error.error || 'Failed to get AI response');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    console.error("Error getting AI response stream:", error);
    throw error;
  }
};

/**
 * Grade a roleplay session by calling the backend API
 */
export const gradeRoleplay = async (
  transcript: string,
  kpis: string[]
): Promise<GradeResult> => {
  try {
    console.log("📤 Sending to grading API:", {
      transcriptLength: transcript.length,
      transcriptPreview: transcript.substring(0, 100) + "...",
      kpisCount: kpis.length,
      kpis
    });

    const response = await fetch(`${BACKEND_URL}/api/ai/grade`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        transcript,
        kpis,
      }),
    });

    console.log("📥 Grading Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to grade roleplay' }));
      console.error("❌ Grading error:", error);
      throw new Error(error.error || 'Failed to grade roleplay');
    }

    const result = await response.json();
    console.log("✅ Grading result:", result);
    return result;
  } catch (error) {
    console.error("❌ Error grading roleplay:", error);
    throw error;
  }
};

/**
 * Save a roleplay session to the backend database
 */
export const saveRoleplay = async (data: {
  eventType: string;
  scenarioTitle: string;
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  transcript: string;
  difficulty: string;
  judgePersona: string;
  performanceIndicators: string[];
  messages: any[];
  keyTakeaway: string;
  topic?: string;
  mode?: string;
}): Promise<{ id: number; success: boolean }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/roleplays`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to save roleplay' }));
      throw new Error(error.error || 'Failed to save roleplay');
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving roleplay:", error);
    throw error;
  }
};
