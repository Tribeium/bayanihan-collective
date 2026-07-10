const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPTS = {
  orientation:
    "You are the escalation-tier AI guide for the Bayanihan Collective, a member-owned cooperative for independent AI developers. You handle orientation questions that were too complex or nuanced for the first-tier assistant. Give thorough, accurate, encouraging answers about how the cooperative works.",
  assistant:
    "You are the escalation-tier Member Assistant for the Bayanihan Collective, a member-owned cooperative for independent AI developers. You handle member questions that were too complex for the first-tier assistant — go deeper and be precise. You are not a freelance marketplace assistant — never suggest commission-based matching or platform fees. Keep answers concise and friendly.",
  mentor:
    "You are the escalation-tier Member Mentor for the Bayanihan Collective. You handle coaching requests that need deeper, more nuanced feedback than the first-tier mentor could give. Be encouraging but honest and specific.",
};

function localFallbackReply(mode, intent) {
  const byIntent = {
    onboarding_inquiry:
      "Welcome to the Collective! As a new member you'll get access to the mutual support case system, the shared resource pool, and the mentorship directory. Want a walkthrough of any of those?",
    resource_request:
      "Members can request or contribute shared resources like compute credits, datasets, and templates through a resource-sharing case. Want me to point you to how to file one?",
    project_matching:
      "Project collaboration matching connects you with other members whose specialization complements yours. Tell me what you're working on and what skills you need.",
    mentorship_request:
      "Peer mentorship requests go through the same intake as other cases, just tagged routine priority. What skill area are you looking for a mentor in?",
    general_faq: "Happy to help — could you say a bit more about what you're trying to do in the Collective?",
    complex:
      "That's a deeper question than I can fully resolve right now — let me note it and a fellow member or coordinator can follow up with specifics.",
  };

  if (mode === "mentor") {
    return "Let's break that down together. What's the specific outcome you're aiming for, and what have you tried so far?";
  }

  return byIntent[intent] || byIntent.general_faq;
}

/**
 * Generates the escalation-tier reply using Claude. Falls back to a canned,
 * intent-aware reply when ANTHROPIC_API_KEY is not configured, so the demo
 * runs without live credentials.
 */
export async function generateEscalatedReply(message, { mode, intent, history = [] } = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { reply: localFallbackReply(mode, intent), source: "local-fallback" };
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.assistant;

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [...history, { role: "user", content: `[Detected intent: ${intent}] ${message}` }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Anthropic API returned ${response.status}: ${errBody}`);
    }

    const data = await response.json();

    // Extended-thinking-capable models can return a "thinking" block before
    // the actual "text" block, so don't assume content[0] is the text block.
    const textBlock = Array.isArray(data.content) ? data.content.find((block) => block.type === "text") : null;

    if (!textBlock?.text) {
      console.error("No text block found in Anthropic response, using local fallback.");
      return { reply: localFallbackReply(mode, intent), source: "local-fallback" };
    }

    return { reply: textBlock.text, source: "claude" };
  } catch (err) {
    console.error("Claude escalation failed, using local fallback:", err.message);
    return { reply: localFallbackReply(mode, intent), source: "local-fallback" };
  }
}
