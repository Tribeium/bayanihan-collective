import { Router } from "express";
import { classifyIntent } from "../services/gemma.js";
import { generateEscalatedReply } from "../services/claude.js";

const router = Router();

// Two-layer pipeline: Gemma (AMD Developer Cloud → Google AI Studio → local fallback) classifies intent first, then Claude
// generates the actual conversational reply, informed by that classification.
router.post("/message", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  const classification = await classifyIntent(message, history);
  const { reply, source } = await generateEscalatedReply(message, {
    mode: "assistant",
    intent: classification.intent,
    history,
  });

  res.json({
    reply,
    replySource: source,
    classification,
  });
});

export default router;
