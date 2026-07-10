const GEMMA_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export const INTENTS = [
  "onboarding_inquiry",
  "resource_request",
  "mentorship_request",
  "project_matching",
  "general_faq",
  "complex",
];

const SYSTEM_PROMPTS = {
  orientation:
    "You are the official AI guide for Bayanihan Collective — a cooperative platform for independent AI developers. Your job is to orient new members. Explain how the cooperative works, member benefits, how to request resources, share skills, and participate in governance. Be warm, clear, and encouraging. Keep responses under 150 words unless the member asks for more detail.",
  assistant:
    "You are the Member Assistant for Bayanihan Collective. Answer member questions about the cooperative — resources, projects, disputes, mentorship, governance, and benefits. Be direct and helpful. If a question is deeply technical or outside your scope, flag it as complex.",
  mentor:
    "You are the Member Mentor for Bayanihan Collective. Your role is to coach members — give constructive feedback on their cooperative participation, help them practice presenting their skills, and guide them on contributing to the collective. Be encouraging but honest.",
};

// Naive keyword fallback so the demo still works without a Gemma/Google AI Studio key.
function classifyLocally(message) {
  const text = message.toLowerCase();
  if (/(join|new member|welcome|onboard|application|apply|member)/.test(text)) {
    return { intent: "onboarding_inquiry", confidence: 0.82 };
  }
  if (/(resource|compute|dataset|gpu|share)/.test(text)) {
    return { intent: "resource_request", confidence: 0.78 };
  }
  if (/(match|collaborat|pair|team up|partner)/.test(text)) {
    return { intent: "project_matching", confidence: 0.75 };
  }
  if (/(mentor|guidance|review my|teach me|coach|practice)/.test(text)) {
    return { intent: "mentorship_request", confidence: 0.8 };
  }
  return { intent: "general_faq", confidence: 0.6 };
}

const FALLBACK_RESPONSES = {
  orientation:
    "Welcome to the Collective! As a member you get access to the mutual support case system, the shared resource pool, and the mentorship directory, plus a voice in cooperative governance. What would you like to know more about?",
  assistant: "Happy to help — could you say a bit more about what you're trying to do in the Collective?",
  mentor:
    "Let's work through it together. Tell me what you'd like to practice or improve, and I'll give you feedback.",
};

function localFallbackResponse(mode, message) {
  const { intent, confidence } = classifyLocally(message);
  return {
    intent,
    confidence,
    response: FALLBACK_RESPONSES[mode] || FALLBACK_RESPONSES.assistant,
    source: "local-fallback",
  };
}

function buildHistoryText(history = []) {
  return history.map((m) => `${m.role === "user" ? "Member" : "Assistant"}: ${m.content}`).join("\n");
}

/**
 * Calls Gemma (Google AI Studio) to classify intent AND generate a response
 * in a single call. Falls back to a local, mode-aware canned response when
 * GOOGLE_AI_STUDIO_API_KEY is not configured or the call fails, so the demo
 * runs without live credentials.
 */
export async function generateModeResponse(mode, message, history = []) {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
  if (!apiKey) {
    return localFallbackResponse(mode, message);
  }

  const model = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it";
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.assistant;
  const historyText = buildHistoryText(history);
  const prompt = `${systemPrompt}\n\nClassify the member's intent as exactly one of: ${INTENTS.join(
    ", "
  )}. Use "complex" for anything deeply technical, sensitive, or outside your scope.\nAlways return JSON: { "intent": string, "confidence": number, "response": string }\n\n${
    historyText ? `Conversation so far:\n${historyText}\n\n` : ""
  }Member: ${message}`;

  try {
    const response = await fetch(`${GEMMA_API_BASE}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            properties: {
              intent: { type: "string", enum: INTENTS },
              confidence: { type: "number" },
              response: { type: "string" },
            },
            required: ["intent", "confidence", "response"],
          },
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "(could not read body)");
      console.error("Gemma API error body:", errBody);
      throw new Error(`Gemma API returned ${response.status}`);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const raw = parts.filter((p) => !p.thought).map((p) => p.text).join("");
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    if (!INTENTS.includes(parsed.intent) || typeof parsed.response !== "string") {
      return localFallbackResponse(mode, message);
    }

    return {
      intent: parsed.intent,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
      response: parsed.response,
      source: "gemma-google-ai-studio",
    };
  } catch (err) {
    console.error("Gemma (Google AI Studio) response generation failed, using local fallback:", err.message);
    return localFallbackResponse(mode, message);
  }
}
