import { useState } from "react";
import { api } from "../api/client.js";
import ChatWidget from "../components/ChatWidget.jsx";

const MODES = [
  {
    id: "orientation",
    label: "Orientation",
    description: "Learn how Bayanihan Collective works — your rights, resources, and role as a member.",
    welcome:
      "Welcome! I'm your orientation guide. Ask me anything about how the cooperative works, or say \"start\" for a walkthrough.",
  },
  {
    id: "assistant",
    label: "Assistant",
    description: "Ask anything about the cooperative. Gemma answers directly.",
    welcome: "Hi! I'm the Member Assistant. Ask me about resources, projects, disputes, mentorship, or governance.",
  },
  {
    id: "mentor",
    label: "Mentor",
    description: "Practice and get coached. Gemma gives you real feedback.",
    welcome:
      "I'm your Member Mentor. Tell me what you'd like to practice — presenting your skills, pitching a project, or handling a dispute — and I'll coach you.",
  },
];

function initialMessages(modeId) {
  const config = MODES.find((m) => m.id === modeId);
  return [{ role: "assistant", content: config.welcome }];
}

export default function MemberAIHub() {
  const [mode, setMode] = useState("orientation");
  const [messagesByMode, setMessagesByMode] = useState({
    orientation: initialMessages("orientation"),
    assistant: initialMessages("assistant"),
    mentor: initialMessages("mentor"),
  });
  const [log, setLog] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const activeMode = MODES.find((m) => m.id === mode);
  const messages = messagesByMode[mode];

  async function handleSend(text) {
    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessagesByMode((prev) => ({ ...prev, [mode]: nextMessages }));
    setSending(true);
    setError(null);

    try {
      const history = nextMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const { response, source, intent, confidence, escalated } = await api.sendMemberAI(
        text,
        mode,
        history.slice(0, -1)
      );

      setMessagesByMode((prev) => ({
        ...prev,
        [mode]: [...prev[mode], { role: "assistant", content: response, source, intent, confidence, escalated }],
      }));

      setLog((prev) =>
        [
          {
            intent,
            confidence,
            source,
            mode,
            at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          },
          ...prev,
        ].slice(0, 5)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="view">
      <h1 className="view__title">Member AI Hub</h1>
      <p className="view__subtitle">{activeMode.description}</p>

      <div className="mode-tabs">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`mode-tabs__btn ${mode === m.id ? "is-active" : ""}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {error && <p className="error-banner">{error}</p>}

      <div className="panel">
        <h2 className="panel__title">Gemma Classification Log</h2>
        {log.length === 0 && <p className="empty-state">No messages sent yet.</p>}
        {log.length > 0 && (
          <ul className="classification-log">
            {log.map((entry, i) => (
              <li key={i} className="classification-log__item">
                <span className="classification-log__intent">{entry.intent}</span>
                <span className="classification-log__meta">
                  {Math.round((entry.confidence || 0) * 100)}% · {entry.source} · {entry.mode} · {entry.at}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel panel--chat">
        <ChatWidget messages={messages} onSend={handleSend} sending={sending} />
      </div>
    </div>
  );
}
