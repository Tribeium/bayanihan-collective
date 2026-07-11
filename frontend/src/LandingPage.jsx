import { useEffect, useRef } from 'react';
import './LandingPage.css';
import tribeiumLogo from './assets/tribeium-logo.png';

/**
 * Bayanihan Collective — marketing landing page.
 * Shown before the member enters the platform (Ops Dashboard / Onboarding
 * Presenter / Member Concierge). Call `onEnter` to switch the app into the
 * main platform view.
 */
export default function LandingPage({ onEnter }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      },
      { threshold: 0.15 }
    );

    root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bayanihan-landing" ref={rootRef}>
<header>
  <nav>
    <div className="brand-row">
      <div className="brand">Bayanihan <em>Collective</em></div>
      <div className="by-tag"><img src={tribeiumLogo} alt="Tribeium logo" />by Tribeium</div>
    </div>
    <div className="navlinks">
      <a href="#solution">Platform</a>
      <a href="#technology">Technology</a>
      <a href="#cta">Get involved</a>
    </div>
    <div className="nav-ctas">
      <a className="btn" href="https://github.com/Tribeium/bayanihan-collective" target="_blank" rel="noopener">GitHub</a>
      <button className="btn solid" onClick={onEnter}>Enter Platform</button>
    </div>
  </nav>
</header>

<section className="hero">
  <div className="wrap">
    <div>
      <div className="eyebrow">Cooperative infrastructure</div>
      <h1>Nobody carries<br />the house <span className="accent">alone.</span></h1>
      <p className="lede">Bayanihan Collective gives independent worker cooperatives the operational backbone they've never had — case tracking, member onboarding, and an AI concierge that actually knows the org, built for people who choose to work together.</p>
      <div className="hero-cta">
        <button className="btn solid" onClick={onEnter}>Enter Platform</button>
        <a className="btn" href="#technology">How it's built</a>
      </div>
    </div>

    <div>
      <div className="signature">
        <svg viewBox="0 0 480 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a nipa hut carried together on bamboo poles by six community members">
          {/* ground */}
          <ellipse cx="240" cy="392" rx="210" ry="14" fill="#16201F" opacity="0.5"/>

          {/* carrying poles */}
          <g stroke="#B98B4E" strokeWidth="6" strokeLinecap="round">
            <line x1="55" y1="300" x2="425" y2="300"/>
            <line x1="55" y1="332" x2="425" y2="332"/>
          </g>

          {/* house (bahay kubo), swaying group */}
          <g className="house">
            {/* stilts resting on poles */}
            <g stroke="#8C6A3F" strokeWidth="7" strokeLinecap="round">
              <line x1="150" y1="300" x2="150" y2="255"/>
              <line x1="330" y1="300" x2="330" y2="255"/>
            </g>
            {/* roof */}
            <polygon points="240,120 100,235 380,235" fill="var(--clay)"/>
            <polygon points="240,140 130,232 350,232" fill="#C4693F"/>
            {/* roof ridge texture */}
            <g stroke="#7E3C24" strokeWidth="2" opacity="0.5">
              <line x1="160" y1="222" x2="240" y2="150"/>
              <line x1="190" y1="228" x2="240" y2="165"/>
              <line x1="220" y1="232" x2="240" y2="180"/>
              <line x1="320" y1="222" x2="240" y2="150"/>
              <line x1="290" y1="228" x2="240" y2="165"/>
              <line x1="260" y1="232" x2="240" y2="180"/>
            </g>
            {/* walls */}
            <rect x="150" y="235" width="180" height="70" fill="#E9C689"/>
            {/* window */}
            <rect x="205" y="252" width="70" height="38" fill="var(--ink)" rx="2"/>
            <line x1="240" y1="252" x2="240" y2="290" stroke="#E9C689" strokeWidth="3"/>
          </g>

          {/* six community figures carrying the poles */}
          <g className="figures" fill="var(--rice)">
            <g className="figure" transform="translate(58,300)">
              <circle cx="0" cy="-46" r="10"/>
              <path d="M -12 -34 Q 0 -20 12 -34 L 8 20 L -8 20 Z"/>
              <line x1="-6" y1="0" x2="-14" y2="34" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="6" y1="0" x2="14" y2="34" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="-10" y1="-14" x2="0" y2="-4" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="10" y1="-14" x2="0" y2="-4" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
            </g>
            <g className="figure" transform="translate(130,332)">
              <circle cx="0" cy="-46" r="10"/>
              <path d="M -12 -34 Q 0 -20 12 -34 L 8 20 L -8 20 Z" fill="var(--sky)"/>
              <line x1="-6" y1="0" x2="-14" y2="34" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="6" y1="0" x2="14" y2="34" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="-10" y1="-8" x2="0" y2="-2" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="10" y1="-8" x2="0" y2="-2" stroke="var(--sky)" strokeWidth="6" strokeLinecap="round"/>
            </g>
            <g className="figure" transform="translate(210,300)">
              <circle cx="0" cy="-46" r="10"/>
              <path d="M -12 -34 Q 0 -20 12 -34 L 8 20 L -8 20 Z" fill="var(--sun)"/>
              <line x1="-6" y1="0" x2="-14" y2="34" stroke="var(--sun)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="6" y1="0" x2="14" y2="34" stroke="var(--sun)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="-10" y1="-14" x2="0" y2="-4" stroke="var(--sun)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="10" y1="-14" x2="0" y2="-4" stroke="var(--sun)" strokeWidth="6" strokeLinecap="round"/>
            </g>
            <g className="figure" transform="translate(270,332)">
              <circle cx="0" cy="-46" r="10"/>
              <path d="M -12 -34 Q 0 -20 12 -34 L 8 20 L -8 20 Z" fill="var(--bamboo)"/>
              <line x1="-6" y1="0" x2="-14" y2="34" stroke="var(--bamboo)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="6" y1="0" x2="14" y2="34" stroke="var(--bamboo)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="-10" y1="-8" x2="0" y2="-2" stroke="var(--bamboo)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="10" y1="-8" x2="0" y2="-2" stroke="var(--bamboo)" strokeWidth="6" strokeLinecap="round"/>
            </g>
            <g className="figure" transform="translate(350,300)">
              <circle cx="0" cy="-46" r="10"/>
              <path d="M -12 -34 Q 0 -20 12 -34 L 8 20 L -8 20 Z" fill="var(--rice)"/>
              <line x1="-6" y1="0" x2="-14" y2="34" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="6" y1="0" x2="14" y2="34" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="-10" y1="-14" x2="0" y2="-4" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="10" y1="-14" x2="0" y2="-4" stroke="var(--rice)" strokeWidth="6" strokeLinecap="round"/>
            </g>
            <g className="figure" transform="translate(422,332)">
              <circle cx="0" cy="-46" r="10"/>
              <path d="M -12 -34 Q 0 -20 12 -34 L 8 20 L -8 20 Z" fill="var(--clay)"/>
              <line x1="-6" y1="0" x2="-14" y2="34" stroke="var(--clay)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="6" y1="0" x2="14" y2="34" stroke="var(--clay)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="-10" y1="-8" x2="0" y2="-2" stroke="var(--clay)" strokeWidth="6" strokeLinecap="round"/>
              <line x1="10" y1="-8" x2="0" y2="-2" stroke="var(--clay)" strokeWidth="6" strokeLinecap="round"/>
            </g>
          </g>
        </svg>
        <div className="sig-caption">six carriers · one house · zero solo operators</div>
      </div>
    </div>
  </div>
</section>

<div className="pole"><span>bayanihan, digitized</span></div>

<section id="problem">
  <div className="wrap reveal">
    <div className="kicker">The problem</div>
    <h2>Cooperatives run on trust. They still run on spreadsheets.</h2>
    <p className="section-lede">Worker cooperatives like CoTech, Patio, and FACTTIC prove the model works — but almost none of them have modern operational tooling. Cases get tracked in group chats. Onboarding is a PDF nobody finishes. Members wait days for answers a system should give in seconds.</p>

    <div className="problem-grid">
      <div className="problem-card">
        <div className="num">01</div>
        <h3>No shared operations layer</h3>
        <p>Case handling, disputes, and escalations live in someone's inbox, not a system the whole co-op can see.</p>
      </div>
      <div className="problem-card">
        <div className="num">02</div>
        <h3>Onboarding doesn't scale</h3>
        <p>Every new member gets a different, informal introduction — no consistent standard for what "ready" means.</p>
      </div>
      <div className="problem-card">
        <div className="num">03</div>
        <h3>Questions outrun answers</h3>
        <p>Routine questions bottleneck on the same two or three people who already carry the most.</p>
      </div>
    </div>
  </div>
</section>

<div className="pole"><span>the platform</span></div>

<section id="solution">
  <div className="wrap reveal">
    <div className="kicker">The solution</div>
    <h2>Three surfaces. One cooperative, working as one.</h2>
    <p className="section-lede">Bayanihan Collective is operational infrastructure built specifically for worker cooperatives — not a generic helpdesk with a co-op logo pasted on.</p>

    <div className="pillars">
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 38 38" fill="none"><rect x="3" y="3" width="32" height="32" rx="4" stroke="var(--sun)" strokeWidth="2"/><line x1="3" y1="14" x2="35" y2="14" stroke="var(--sun)" strokeWidth="2"/><circle cx="10" cy="8.5" r="1.6" fill="var(--sun)"/><circle cx="15" cy="8.5" r="1.6" fill="var(--sun)"/></svg>
        <h3>Ops Dashboard</h3>
        <p>Every case, dispute, and escalation tier in one live view — with a real audit trail instead of a group-chat scroll.</p>
        <span className="tag">Case tracking</span>
      </div>
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 38 38" fill="none"><path d="M19 4 L33 12 L33 26 L19 34 L5 26 L5 12 Z" stroke="var(--bamboo)" strokeWidth="2"/><circle cx="19" cy="19" r="5" stroke="var(--bamboo)" strokeWidth="2"/></svg>
        <h3>Onboarding Presenter</h3>
        <p>New members work through real talking points, ask live questions, and clear a scroll-gated quiz before day one.</p>
        <span className="tag">Member onboarding</span>
        <div className="stack">
          <span className="chip">AMD Developer Cloud</span>
          <span className="chip">Gemma</span>
        </div>
      </div>
      <div className="pillar">
        <svg className="pillar-icon" viewBox="0 0 38 38" fill="none"><path d="M6 8 H32 V24 H16 L9 31 V24 H6 Z" stroke="var(--clay)" strokeWidth="2"/></svg>
        <h3>Member Concierge</h3>
        <p>Ask anything, anytime. Gemma reads the intent, Claude writes the answer — every time, in view.</p>
        <span className="tag">AI concierge</span>
        <div className="stack">
          <span className="chip">AMD Developer Cloud</span>
          <span className="chip">Gemma</span>
          <span className="chip">Claude</span>
        </div>
      </div>
    </div>
  </div>
</section>

<div className="pole"><span>how it thinks</span></div>

<section id="technology">
  <div className="wrap reveal">
    <div className="dual">
      <div className="dual-copy">
        <div className="kicker">Two-layer AI</div>
        <h2>Gemma is the reflex. Claude is the voice.</h2>
        <div className="quote-block">"Every single message hits Gemma first — no exceptions. Gemma reads intent in real time, then hands that read straight to Claude, who writes the actual reply."</div>
        <p>Gemma classifies intent on every message, running on a three-tier chain anchored in AMD Developer Cloud. Claude then generates the response every time — grounded in what Gemma just read. Two models, two jobs, one reply — and the badge on every message shows exactly which tier of Gemma did the reading.</p>
      </div>
      <div className="dual-visual">
        <div className="flow-row"><span className="dot gemma"></span><span className="flow-label">Member sends a message</span><span className="flow-sub">t+0ms</span></div>
        <div className="flow-row"><span className="dot gemma"></span><span className="flow-label">Gemma classifies intent</span><span className="flow-sub">AMD Developer Cloud tier</span></div>
        <div className="flow-row"><span className="dot gemma"></span><span className="flow-label">Confidence + intent passed forward</span><span className="flow-sub">every message, no skip</span></div>
        <div className="flow-row"><span className="dot claude"></span><span className="flow-label">Claude writes the response</span><span className="flow-sub">grounded on Gemma's read</span></div>
        <div className="flow-row"><span className="dot claude"></span><span className="flow-label">Reply returned with source badge</span><span className="flow-sub">always labeled</span></div>
      </div>
    </div>

    <div className="stats">
      <div className="stat"><div className="n">3</div><div className="l">Platform surfaces, one member record</div></div>
      <div className="stat"><div className="n">2</div><div className="l">AI layers, always labeled</div></div>
      <div className="stat"><div className="n">0</div><div className="l">Black-box answers</div></div>
      <div className="stat"><div className="n">100%</div><div className="l">Open source, MIT licensed</div></div>
    </div>
  </div>
</section>

<section className="cta" id="cta">
  <div className="wrap reveal">
    <div className="kicker" style={{ justifyContent: 'center', display: 'flex' }}>Get involved</div>
    <h2>Bring your cooperative into the room.</h2>
    <p className="lede">Bayanihan Collective is open source and built for any worker cooperative ready to trade spreadsheets for a system that actually carries its share.</p>
    <div className="cta-buttons">
      <button className="btn solid" onClick={onEnter}>Enter Platform</button>
      <a className="btn" href="https://github.com/Tribeium/bayanihan-collective" target="_blank" rel="noopener">Read the source on GitHub</a>
    </div>
  </div>
</section>

<footer>
  <div className="wrap">
    <div className="footer-top">
      <div className="attribution">
        <div className="attrib-block">
          <div className="eyebrow-mini">Created &amp; built by</div>
          <div className="tribeium-mark">
            <img src={tribeiumLogo} alt="Tribeium logo" />
            <span className="name">Tribeium</span>
          </div>
        </div>
        <div className="attrib-block">
          <div className="eyebrow-mini">Powered by</div>
          <div className="powered-chips">
            <span className="chip">AMD Developer Cloud</span>
            <span className="chip">Gemma</span>
            <span className="chip">Claude</span>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div>Bayanihan Collective — AMD Developer Hackathon, Track 3</div>
      <div className="flinks">
        <a href="#solution">Platform</a>
        <a href="#technology">Technology</a>
        <a href="https://github.com/Tribeium/bayanihan-collective" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}
