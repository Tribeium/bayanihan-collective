const GEMMA_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const INTENTS = [
  "onboarding_inquiry",
  "resource_sharing",
  "project_matching",
  "mentorship_request",
  "general_question",
];

// Naive keyword fallback so the demo still works without a Gemma/Google AI Studio key.
function classifyLocally(message) {
  const text = message.toLowerCase();
  if (/(join|new member|welcome|onboard|application|apply|member)/.test(text)) {
    return { intent: "onboarding_inquiry", confidence: 0.82 };
  }
  if (/(resource|compute|dataset|gpu|share)/.test(text)) {
    return { intent: "resource_sharing", confidence: 0.78 };
  }
  if (/(match|collaborat|pair|team up|partner)/.test(text)) {
    return { intent: "project_matching", confidence: 0.75 };
  }
  if (/(mentor|guidance|review my|teach me)/.test(text)) {
    return { intent: "mentorship_request", confidence: 0.8 };
  }
  return { intent: "general_question", confidence: 0.6 };
}

function classifyWithFallback(message, history = []) {
  const direct = classifyLocally(message);
  if (direct.intent !== "general_question") {
    return { ...direct, source: "local-fallback" };
  }

  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  if (lastAssistant?.content) {
    const contextual = classifyLocally(`${lastAssistant.content} ${message}`);
    if (contextual.intent !== "general_question") {
      return { intent: contextual.intent, confidence: 0.65, source: "local-fallback-context" };
    }
  }

  return { ...direct, source: "local-fallback" };
}

async function classifyWithAmdDevCloud(message) {
  const baseUrl = process.env.AMD_DEVCLOUD_GEMMA_URL;
  if (!baseUrl) return null;

  const model = process.env.AMD_DEVCLOUD_GEMMA_MODEL || "google/gemma-3-12b-it";
  const prompt = `Classify the user's message into exactly one intent from this list: ${INTENTS.join(
    ", "
  )}. Respond with strict JSON only, no other text: {"intent": "...", "confidence": 0.0-1.0}.\n\nMessage: "${message}"`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "(could not read body)");
      console.error("AMD Developer Cloud Gemma error body:", errBody);
      throw new Error(`AMD Developer Cloud Gemma returned ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    console.log("AMD Developer Cloud Gemma raw content:", JSON.stringify(raw));
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    if (!INTENTS.includes(parsed.intent)) {
      return null;
    }

    return {
      intent: parsed.intent,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
      source: "gemma-amd-devcloud",
    };
  } catch (err) {
    console.error("Gemma (AMD Developer Cloud) classification failed:", err.message);
    return null;
  }
}

async function classifyWithGoogleAiStudio(message, history = []) {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
  if (!apiKey) {
    return classifyWithFallback(message, history);
  }

  const model = process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it";
  const prompt = `Classify the user's message into exactly one intent from this list: ${INTENTS.join(
    ", "
  )}. Respond with strict JSON only: {"intent": "...", "confidence": 0.0-1.0}.\n\nMessage: "${message}"`;

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
          temperature: 0,
          maxOutputTokens: 800,
          responseMimeType: "application/json",
            responseJsonSchema: {
              type: "object",
              properties: {
                intent: { type: "string", enum: INTENTS },
                confidence: { type: "number" },
              },
              required: ["intent", "confidence"],
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
    console.log("Gemma raw content:", JSON.stringify(raw));
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");

    if (!INTENTS.includes(parsed.intent)) {
      return classifyWithFallback(message, history);
    }

    return {
      intent: parsed.intent,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
      source: "gemma-google-ai-studio",
    };
  } catch (err) {
    console.error("Gemma (Google AI Studio) classification failed, using local fallback:", err.message);
    return classifyWithFallback(message, history);
  }
}

export async function classifyIntent(message, history = []) {
  const amdResult = await classifyWithAmdDevCloud(message);
  if (amdResult) {
    return amdResult;
  }

  return classifyWithGoogleAiStudio(message, history);
}
