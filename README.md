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