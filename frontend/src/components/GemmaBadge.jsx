export default function GemmaBadge({ message }) {
  if (!message || !message.source) return null;
  const pct = Math.round((message.confidence || 0) * 100);

  if (message.escalated && message.source === "claude-escalation") {
    return (
      <div className="gemma-badge gemma-badge--escalated">
        <span className="gemma-badge__dot" />
        🟡 Escalated to Claude · Gemma classified: <strong>{message.intent}</strong>
      </div>
    );
  }

  if (message.source === "gemma-google-ai-studio") {
    return (
      <div className="gemma-badge gemma-badge--gemma">
        <span className="gemma-badge__dot" />
        🟢 Gemma (Google AI Studio) · <strong>{message.intent}</strong> · {pct}%
      </div>
    );
  }

  return (
    <div className="gemma-badge gemma-badge--fallback">
      <span className="gemma-badge__dot" />
      ⚪ Local fallback
    </div>
  );
}
