# Paano i-drop sa `frontend/src/`

## 1. Copy files
```
frontend/src/LandingPage.jsx
frontend/src/LandingPage.css
frontend/src/assets/tribeium-logo.png
```

## 2. I-wire sa `App.jsx`

Base sa current structure niyo (3 views: OpsDashboard / TrainingSimulator / MemberConcierge,
state-based switching). Idagdag lang itong maliit na state bago yung existing view logic:

```jsx
import { useState } from "react";
import LandingPage from "./LandingPage";
// ...existing imports (OpsDashboard, TrainingSimulator/Onboarding Presenter, MemberConcierge)

function App() {
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // ...existing App return (tabs/views) — unchanged
}
```

Kung gusto mong bumalik sa landing anytime (hal. logo click sa main app), pwede mo ring i-expose
yung `setShowLanding(true)` sa isang nav button sa main app shell — optional lang.

## 3. Ano ang ginawa na, walang kailangan pang ayusin

- **CSS scoped na** sa `.bayanihan-landing` — hindi ito mag-a-apektuhin ng existing styles ng Ops
  Dashboard / Onboarding Presenter / Member Concierge, kahit parehong nasa DOM.
- **Logo naka-import bilang asset file** (`./assets/tribeium-logo.png`), hindi na naka-embed na
  malaking base64 string sa code — mas maliit yung bundle.
- **"Enter Platform" button** — 3 lugar: nav (laging visible), hero (primary CTA), at final CTA
  section — lahat tumatawag sa `onEnter` prop papunta sa main app.
- **Real links pa rin naka-intact**: GitHub repo link, at Technology section copy na tumpak sa
  totoong Gemma→Claude two-call pipeline.
- Na-compile check gamit esbuild — walang JSX syntax errors.

## 4. Kung gusto niyong i-verify muna bago i-commit

```bash
cd frontend
npm run dev
```
Buksan yung dev URL — dapat lumabas muna yung landing page, tapos pag-click ng "Enter Platform"
lilipat sa existing app view (Ops Dashboard atbp.).
