# Bayanihan Collective

A cooperative operations + AI concierge platform scaffold for **independent AI developers**,
built for the AMD Developer Hackathon (Unicorn Track).

This is a **member-owned cooperative model** — not a commission-based freelance marketplace.
Members hold a stake in governance, share resources, and resolve disputes through a tiered
peer-mediation process rather than a platform taking a cut of every engagement.

## What's here

A single-page app with one shell/nav and three views:

1. **Ops Dashboard** — case tracking for cooperative members. Tracks Case ID, Developer Name,
   Specialization, Case Type, Status (`Waiting → Under Review → Escalated → Resolved`), Assigned
   Mediator, Due Date, and Priority, with a 3-tier escalation model (Routine / Escalate to Peer
   Mediator / Escalate to Coop Board). Call/Email/Text buttons are **mock/log-only** — nothing is
   actually sent.
2. **Onboarding Presenter** *(formerly "Training Simulator")* — a guided onboarding module:
   session setup with a "verified member" check, a live practice view with a pausable timer and
   scroll-gated content, a scroll-to-unlock quiz pulled from the Q&A bank, an **Available Mentors**
   panel (mock/placeholder contacts for deeper questions), a live **Ask a Question** box answered
   by the real Gemma → Claude pipeline grounded in the current module's content, and session
   history.
3. **Member Concierge** — a chat widget for welcoming new members and answering general
   questions. Uses a two-layer AI pipeline: **Gemma** classifies intent first, visibly shown in
   the UI as a badge (e.g. "Gemma (AMD Developer Cloud) classified: onboarding_inquiry (95%) →
   routing to Claude"), then **Claude** generates the actual reply.

All seed data (developer names, cases, training content) is fictional, created for this scaffold.

## Gemma classification: three-tier fallback chain

Both Member Concierge and the Onboarding Presenter's Ask-a-Question feature route intent
classification through the same chain, in order:

1. **AMD Developer Cloud** — a self-hosted Gemma model (`google/gemma-3-12b-it` by default) served
   via vLLM on a real AMD Instinct™ MI300X GPU instance, reached through a Jupyter proxy URL.
   Badge label: **"Gemma (AMD Developer Cloud)"**. This is the primary, AMD-hosted path.
2. **Google AI Studio** — Google's official Gemma API, used automatically if the AMD Developer
   Cloud tier is unreachable. Badge label: **"Gemma (Google AI Studio)"**.
3. **Local keyword fallback** — a simple regex/keyword classifier used if both of the above fail
   or are unconfigured. Badge label: **"Gemma (local fallback)"**. Keeps the demo functional
   end-to-end with zero API keys.

In every case, **Claude remains the primary responder** — Gemma's job is intent classification
only; Claude generates the actual reply shown to the member.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Orchestration:** Docker Compose
- **License:** MIT

## Project structure

```
bayanihan-collective/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── routes/         # cases, training, concierge
│       ├── services/       # claude.js, gemma.js (three-tier chain)
│       └── data/           # seed JSON (cases, training content)
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── api/            # fetch client for the backend
        ├── components/     # Nav, CaseTable, ChatWidget, GemmaBadge, AvailableMentors, etc.
        └── views/           # OpsDashboard, TrainingSimulator (UI: "Onboarding Presenter"), MemberConcierge
```

## Running locally

### With Docker Compose (recommended)

```bash
cp .env.example .env
# fill in the keys you have available — all are optional for the demo, see below
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Without Docker

```bash
# backend
cd backend
npm install
cp ../.env.example .env
npm run dev

# frontend, in a second terminal
cd frontend
npm install
npm run dev
```

## Environment variables

| Variable                        | Purpose                                                        |
|----------------------------------|------------------------------------------------------------------|
| `ANTHROPIC_API_KEY`              | Claude — generates concierge/onboarding replies                 |
| `ANTHROPIC_MODEL`                | Claude model string (default `claude-sonnet-5`)                 |
| `AMD_DEVCLOUD_GEMMA_URL`         | vLLM proxy URL for the AMD Developer Cloud Gemma instance        |
| `AMD_DEVCLOUD_GEMMA_MODEL`       | Model served on AMD Developer Cloud (default `google/gemma-3-12b-it`) |
| `AMD_DEVCLOUD_JUPYTER_TOKEN`     | Access token for the AMD Developer Cloud notebook/proxy          |
| `GOOGLE_AI_STUDIO_API_KEY`       | Fallback Gemma tier via Google AI Studio                         |
| `GEMMA_MODEL`                    | Gemma model string used for the Google AI Studio tier             |
| `N8N_WEBHOOK_URL`                | Optional — enables real SMS/Email notify from the Ops Dashboard  |

## Running without API keys

The backend works without any live keys: if none of the Gemma tiers are configured, the concierge
and onboarding Q&A fall back to a local keyword-based intent classifier and canned-but-intent-aware
replies, so the full demo flow (including the classification badge) still works end-to-end for
judging or offline development.

## API overview

| Method | Path                          | Description                                  |
|--------|-------------------------------|-----------------------------------------------|
| GET    | `/api/cases`                  | List all cases                                |
| GET    | `/api/cases/stats`            | Total/waiting/escalated/resolved counts       |
| PATCH  | `/api/cases/:id`               | Update status, tier, mediator, or priority    |
| POST   | `/api/cases/:id/actions`       | Log a mock call/email/text                    |
| POST   | `/api/cases/:id/notify`        | Trigger a real SMS/Email follow-up via an n8n webhook (mock success if `N8N_WEBHOOK_URL` unset) |
| GET    | `/api/training/modules`       | Onboarding module content                     |
| GET    | `/api/training/qa-bank`       | Q&A bank, optionally filtered by module        |
| GET    | `/api/training/sessions`      | Practice session history                      |
| POST   | `/api/training/sessions`      | Log a completed practice session              |
| POST   | `/api/training/ask`           | Ask a live question during an onboarding session (Gemma classify → Claude reply, grounded in module content) |
| POST   | `/api/concierge/message`      | Send a chat message (Gemma classify → Claude reply) |

## Notes for hackathon judging

- The Ops Dashboard's Call/Email/Text buttons are mock/log-only — actions are logged in-memory only.
  A separate `POST /api/cases/:id/notify` endpoint exists for real n8n-triggered SMS/Email
  follow-ups; it degrades gracefully to a mock success when `N8N_WEBHOOK_URL` is unset.
- All case, developer, and training data is seeded fiction; it resets on backend restart.
- The Onboarding Presenter's Available Mentors panel is a mock/placeholder — the four listed
  mentors are not live contacts in this build.
- The Gemma → Claude pipeline is designed to degrade gracefully without API keys, but uses the
  real AMD Developer Cloud → Google AI Studio → local-fallback chain the moment credentials are
  supplied.