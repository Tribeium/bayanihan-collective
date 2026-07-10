import { useState } from "react";
import Nav from "./components/Nav.jsx";
import OpsDashboard from "./views/OpsDashboard.jsx";
import MemberAIHub from "./views/MemberAIHub.jsx";
import MemberConcierge from "./views/MemberConcierge.jsx";

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="app-shell">
      <Nav activeView={activeView} onNavigate={setActiveView} />
      <main className="app-shell__main">
        {activeView === "dashboard" && <OpsDashboard />}
        {activeView === "aiHub" && <MemberAIHub />}
        {activeView === "concierge" && <MemberConcierge />}
      </main>
    </div>
  );
}
