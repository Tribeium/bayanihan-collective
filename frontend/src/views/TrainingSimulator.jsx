import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/client.js";
import Timer from "../components/Timer.jsx";
import AvailableMentors from "../components/AvailableMentors.jsx";
import GemmaBadge from "../components/GemmaBadge.jsx";

function buildQuiz(qa, allQa) {
  if (!qa) return null;
  const distractors = allQa
    .filter((q) => q.id !== qa.id)
    .map((q) => q.suggestedAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const options = [qa.suggestedAnswer, ...distractors].sort(() => Math.random() - 0.5);
  return { question: qa.question, correctAnswer: qa.suggestedAnswer, options };
}

export default function TrainingSimulator() {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [qaBank, setQaBank] = useState([]);
  const [allQaBank, setAllQaBank] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);
  const [hasReadTalkingPoints, setHasReadTalkingPoints] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [askLog, setAskLog] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    Promise.all([api.getTrainingModules(), api.getSessionHistory(), api.getQaBank()])
      .then(([moduleData, historyData, fullQaData]) => {
        setModules(moduleData);
        setHistory(historyData);
        setAllQaBank(fullQaData);
        if (moduleData.length) setSelectedModuleId(moduleData[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedModuleId) {
      api.getQaBank(selectedModuleId).then(setQaBank).catch((err) => setError(err.message));
    }
  }, [selectedModuleId]);

  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const moduleQa = qaBank.find((qa) => qa.moduleId === selectedModuleId) || qaBank[0];

  const quizForModule = useMemo(
    () => (moduleQa ? buildQuiz(moduleQa, allQaBank) : null),
    [moduleQa, allQaBank]
  );

  function startSession() {
    setSessionActive(true);
    setRunning(true);
    setElapsed(0);
    setHasReadTalkingPoints(false);
    setSelectedOption(null);
    setQuizPassed(false);
    setQuiz(quizForModule);
    setAskLog([]);
    setTimeout(() => {
      const el = scrollRef.current;
      if (el && el.scrollHeight <= el.clientHeight) {
        setHasReadTalkingPoints(true);
      }
    }, 100);
  }

  function handleTalkingPointsScroll(e) {
    const el = e.target;
    const scrolledToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 16;
    if (scrolledToBottom) setHasReadTalkingPoints(true);
  }

  function submitAnswer(option) {
    if (quizPassed) return;
    setSelectedOption(option);
    if (option === quiz?.correctAnswer) {
      setQuizPassed(true);
      setRunning(false);
    }
  }

  async function completeModule() {
    setSessionActive(false);
    try {
      const saved = await api.logSession({
        moduleId: selectedModuleId,
        audienceMode: "n/a",
        durationSeconds: elapsed,
        sentimentSummary: "Quiz passed — module completed",
      });
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAsk(e) {
    e.preventDefault();
    if (!askInput.trim() || asking) return;
    const question = askInput.trim();
    setAskInput("");
    setAsking(true);
    const nextLog = [...askLog, { role: "user", content: question }];
    setAskLog(nextLog);
    try {
      const priorHistory = askLog.map((m) => ({ role: m.role, content: m.content }));
      const { reply, classification } = await api.askTrainingQuestion(
        question,
        selectedModuleId,
        priorHistory
      );
      setAskLog((prev) => [...prev, { role: "assistant", content: reply, classification }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setAsking(false);
    }
  }

  if (loading) return <p className="loading-state">Loading onboarding content…</p>;

  return (
    <div className="view">
      <h1 className="view__title">Onboarding Presenter</h1>
      <p className="view__subtitle">
        Your guided introduction to Bayanihan Collective — explore our mission, resource sharing,
        and governance as you begin your journey as a member.
      </p>

      {error && <p className="error-banner">{error}</p>}

      {!sessionActive && (
        <div className="panel">
          <h2 className="panel__title">Session Setup</h2>
          <label className="verify-checkbox">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            I am a verified member
          </label>
          <div className="setup-row">
            <label>
              Module
              <select value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)}>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {selectedModule && (
            <div className="module-preview">
              <p>{selectedModule.summary}</p>
            </div>
          )}
          <button
            className="btn btn--primary"
            onClick={startSession}
            disabled={!selectedModuleId || !verified}
          >
            Start Onboarding Session
          </button>
        </div>
      )}

      {sessionActive && selectedModule && (
        <div className="panel">
          <div className="practice-header">
            <h2 className="panel__title">{selectedModule.title}</h2>
            <Timer running={running} onTick={setElapsed} />
          </div>
          <div className="talking-points-scroll" onScroll={handleTalkingPointsScroll} ref={scrollRef}>
            <ul className="talking-points">
              {selectedModule.talkingPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
          {!hasReadTalkingPoints && (
            <p className="module-preview">Scroll to the end of the talking points to continue.</p>
          )}

          <div className="quiz-panel">
            <h3 className="panel__title">Ask a Question</h3>
            <div className="chat-widget__log">
              {askLog.map((m, i) => (
                <div key={i} className={`chat-message chat-message--${m.role}`}>
                  {m.role === "assistant" && <GemmaBadge classification={m.classification} />}
                  <div className="chat-message__bubble">{m.content}</div>
                </div>
              ))}
              {asking && (
                <div className="chat-message chat-message--assistant">
                  <div className="chat-message__bubble chat-message__bubble--pending">Thinking…</div>
                </div>
              )}
            </div>
            <form className="chat-widget__input-row" onSubmit={handleAsk}>
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask about this module…"
              />
              <button type="submit" className="btn btn--primary" disabled={asking}>
                Ask
              </button>
            </form>
          </div>

          {hasReadTalkingPoints && quiz && (
            <div className="quiz-panel">
              <h3 className="panel__title">Quick Check</h3>
              <p>{quiz.question}</p>
              {quiz.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === quiz.correctAnswer;
                const cls = isSelected
                  ? isCorrect
                    ? "btn quiz-option quiz-option--correct"
                    : "btn quiz-option quiz-option--incorrect"
                  : "btn quiz-option";
                return (
                  <button key={i} className={cls} onClick={() => submitAnswer(opt)} disabled={quizPassed}>
                    {opt}
                  </button>
                );
              })}
              {quizPassed && (
                <button className="btn btn--primary" onClick={completeModule} style={{ marginTop: "0.75rem" }}>
                  Complete Module
                </button>
              )}
              {selectedOption && selectedOption !== quiz.correctAnswer && (
                <p className="module-preview">Not quite — try another option.</p>
              )}
            </div>
          )}
        </div>
      )}

      <AvailableMentors />

      <div className="panel">
        <h2 className="panel__title">Session History</h2>
        {history.length === 0 && <p className="empty-state">No sessions completed yet.</p>}
        {history.length > 0 && (
          <table className="history-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Duration</th>
                <th>Summary</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>{modules.find((m) => m.id === h.moduleId)?.title || h.moduleId}</td>
                  <td>{h.durationSeconds}s</td>
                  <td>{h.sentimentSummary}</td>
                  <td>{new Date(h.completedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}