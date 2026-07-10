import { Router } from "express";
import { generateModeResponse } from "../services/gemma.js";
import { generateEscalatedReply } from "../services/claude.js";

const VALID_MODES = ["orientation", "assistant", "mentor"];
const CONFIDENCE_THRESHOLD = 0.6;

const router = Router();

// Single-call pipeline: Gemma (Google AI Studio) classifies intent AND
// generates the response. Only "complex" or low-confidence classifications
// escalate to Claude for a deeper reply.
router.post("/", async (req, res) => {
  const { message, mode, conversationHistory } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }
  if (!VALID_MODES.includes(mode)) {
    return res.status(400).json({ error: `mode must be one of: ${VALID_MODES.join(", ")}` });
  }

  const history = Array.isArray(conversationHistory) ? conversationHistory : [];
  const gemmaResult = await generateModeResponse(mode, message, history);

  const shouldEscalate = gemmaResult.intent === "complex" || gemmaResult.confidence < CONFIDENCE_THRESHOLD;

  if (!shouldEscalate) {
    return res.json({
      response: gemmaResult.response,
      source: gemmaResult.source,
      intent: gemmaResult.intent,
      confidence: gemmaResult.confidence,
      mode,
      escalated: false,
    });
  }

  const { reply, source } = await generateEscalatedReply(message, {
    mode,
    intent: gemmaResult.intent,
    history,
  });

  res.json({
    response: reply,
    source: source === "claude" ? "claude-escalation" : source,
    intent: gemmaResult.intent,
    confidence: gemmaResult.confidence,
    mode,
    escalated: true,
  });
});

export default router;
