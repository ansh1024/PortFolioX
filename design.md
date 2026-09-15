# PortfolioX — Design Document (UI/UX)

## 1. Design Principles

1. **Decision-support, not data-dump.** Every screen should answer "what should I do" before "here's raw data." Numbers come with reasoning attached.
2. **Dynamic by user, not by toggle.** The dashboard reshapes based on inferred risk behavior — the user never manually picks a "mode."
3. **Transparency over magic.** Since the scoring engine is rules-based, the UI should always let the user see *why* a score is what it is. Never show a number without a reasoning trail one click away.
4. **Fintech-appropriate restraint.** Financial tools should feel calm and trustworthy, not gamified. Avoid loud colors, confetti, or casino-like feedback — this is a signal fintech recruiters specifically look for (regulatory/compliance instinct).

---

## 2. Visual Language

| Element | Choice | Reasoning |
|---|---|---|
| Primary palette | Deep navy (#0B1F3A) + slate gray + single accent (teal #14B8A6) | Trust + calm; avoids generic "fintech blue-and-green SaaS" cliché by using navy as the dominant, not baby blue |
| Verdict colors | Apply = teal, Watch = amber (#F59E0B), Skip = muted red (#DC2626) | Immediately scannable, but muted tones avoid alarming/gamified feel |
| Typography | Inter or IBM Plex Sans for UI; tabular figures for all numeric data | Numeric alignment matters a lot in finance UIs — misaligned numbers look unpolished |
| Charts | recharts, minimal gridlines, no 3D/gradient fills | Data-dense but not decorative — reads as a serious tool |
| Density | Medium-dense (not consumer-app spacious, not Bloomberg-terminal dense) | Signals "built for someone who checks this often," matching your own usage pattern |

---

## 3. Core Screens

### 3.1 Login / Signup
- Minimal, single-column form
- No unnecessary marketing copy — this is a portfolio tool, not a landing page pitch

### 3.2 Dashboard (the centerpiece — this is what changes per user)
Layout: top summary strip + dynamic widget grid below.

**Summary strip (always present):**
- Total portfolio value (IPO gains realized + SIP current value)
- Overall XIRR
- Risk profile badge (e.g., "Moderate — based on your last 12 decisions")

**Dynamic widget grid (reorders/reweights based on `RiskProfileContext`):**
- *Aggressive-profile user* → IPO opportunity feed ranked by score shown first, SIP allocation shown second, smaller
- *Conservative-profile user* → SIP consistency + allocation-drift-from-target shown first, IPO feed shown second, smaller
- *Moderate-profile user* → balanced 50/50 split

This is the literal implementation of "dynamic per user" — not a cosmetic theme change, but a genuine reordering of information priority based on behavior.

### 3.3 IPO List Page
- Card grid, each card: company name, GMP%, subscription×, **ScoreBadge** (Apply/Watch/Skip)
- Sort/filter by score, sector, close date
- Clicking a card → IPO Detail Page

### 3.4 IPO Detail Page
- Full score breakdown via **ScoreReasoningPanel**: shows each weighted factor (GMP, subscription, sector history, personal history) and its individual contribution — like a simplified "explainability" panel
- CTA: "Log My Application" → records the user's actual decision (for future personalization)
- Historical section: "Similar past IPOs and how they listed" — ties back to backtesting data

### 3.5 SIP / Mutual Fund Page
- Table of active SIPs: fund name, category, monthly amount, current XIRR
- Allocation donut chart: current split vs target split by category
- Drift warning banner if allocation has drifted >X% from target

### 3.6 Backtest Report Page
- Shows engine performance against historical seed data: "Of the IPOs the engine would have scored 'Apply,' X% listed positively"
- This page exists specifically to give you a strong, honest interview talking point — "I validated my logic before trusting it"

### 3.7 Risk Profile Page
- Shows how the current risk category was derived (not a quiz result — a behavior summary)
- E.g., "You've applied to 6 IPOs in the last 6 months, 4 of which had subscription >10x — categorized as Moderate-Aggressive"

### 3.8 Ask Portfolio (V2 — GenAI layer)
- Simple chat-style input: "How did I do on IPOs where GMP was above 40%?"
- Answer rendered as text + an inline mini-chart pulled from the actual query result — not a black-box answer, always traceable to real data

---

## 4. Interaction Details Worth Calling Out in Interviews

- **Score badges are never just colored text** — hovering/tapping always surfaces the reasoning panel. This is a conscious UX decision against "trust me" AI/scoring UX patterns.
- **No modal-heavy flows for core actions** (logging an application, adding a SIP) — inline forms, since this is a tool used frequently and modals add friction for repeat use.
- **Empty states matter** — a new user with no history should see a clear "here's how scoring gets more personalized as you use this" message rather than a blank dashboard, since the personalization story is the USP and should be visible even before data exists.

---

## 5. Responsive Behavior

- Desktop-first (this is a tool used at a desk during market hours, not a mobile-casual app) but fully usable on mobile for checking scores on the go
- Dynamic widget grid collapses to a single stacked column on mobile, order preserved (risk-priority ordering still applies)

---

## 6. What NOT to do (guardrails against generic "fintech template" look)

- No stock-photo-style hero banners
- No generic dashboard-template card shadows/gradients — flat design with intentional whitespace
- No "AI-powered ✨" badges or sparkle icons — let the reasoning panel demonstrate the intelligence instead of labeling it
