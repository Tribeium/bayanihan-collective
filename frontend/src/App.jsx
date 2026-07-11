import { useState } from "react";
import Nav from "./components/Nav.jsx";
import OpsDashboard from "./views/OpsDashboard.jsx";
import TrainingSimulator from "./views/TrainingSimulator.jsx";
import MemberConcierge from "./views/MemberConcierge.jsx";
import LandingPage from "./LandingPage.jsx";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-shell">
      <Nav activeView={activeView} onNavigate={setActiveView} />
      <main className="app-shell__main">
        {activeView === "dashboard" && <OpsDashboard />}
        {activeView === "training" && <TrainingSimulator />}
        {activeView === "concierge" && <MemberConcierge />}
      </main>
    </div>
  );
}
