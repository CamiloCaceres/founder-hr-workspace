# Founder HR Team — Build Guide

**Workspace:** `hr-workspace/`
**Framing:** A solo founder at week 0 of formal people ops downloads
Houston and "hires" a people department. They've just made or are about
to make their first 1–5 hires. No HR person. No recruiter on retainer.
The four agents below cover the full surface — recruiting, HR helpdesk,
performance, retention — with one shared `people-context.md` keeping
them aligned on values, leveling, comp, and escalation rules.

This document is the **team-level spec**. It sits above the per-agent
research MDs (in `research/`). Build order, agent roster, skill lists,
and use cases are decided here.

---

## Who we're building for

**The solo founder, week 0 of formal people ops.** They have:

- A product, customers, and 1–5 early hires (full-time, contractor, or
  fractional). Or their first hire starts Monday.
- A Google Workspace + Slack + a payroll/HRIS (Gusto · Deel · Rippling
  · Justworks — pick one, they don't care which). Maybe an ATS (Ashby ·
  Greenhouse · Lever · Workable), or maybe just a Notion/Google Form
  pipeline.
- Offers and contracts in Google Docs. No handbook yet. No leveling
  framework. No comp bands. No review cycle.
- A growing feeling that "I should probably formalize this" — triggered
  by a hiring miss, a retention scare, a policy question they couldn't
  answer, or an investor asking about people ops.

What they need is **not** a 50-seat-license HRIS they'll under-use. They
need a people team they can chat with that drafts the artifacts (offer
letters, PIPs, policy answers, review templates) and keeps them
consistent.

**The "done" line:** the founder can run weekly people ops — screen
candidates, onboard new hires, answer team policy questions, catch
retention risk, prep review cycles — without a human HR-person in the
loop for that function.

---

## The four agents

Four hireable roles. The granularity test (Philosophy §2): each is a
role a human could hold. We do NOT split "Recruiter" and "Sourcer" —
that's one role at this scale. We do NOT split "Performance" and
"Retention" — same feedback loop (1:1s → health signal → intervention).

| # | Agent | Hired to… | Primary owner of |
|---|-------|-----------|------------------|
| 1 | **Head of People** (`head-of-people`) | Own the values, leveling, comp stance, and weekly readout. Coordinate the other three. | `people-context.md`, employer-brand synthesis, voice calibration |
| 2 | **Recruiter** (`recruiter`) | Run the hiring loop end-to-end — source, screen, score, prep interviewers, offer, debrief | Candidate pipeline, offer drafts, interview loops |
| 3 | **People Ops** (`people-ops`) | The HR helpdesk — policy answers, onboarding, approvals, compliance | Policy Q&A, onboarding plans, compliance calendar |
| 4 | **Performance & Retention** (`performance-retention`) | Weekly check-ins, retention scoring, review cycles, PIP drafting | 1:1 rhythms, retention scores, review-cycle artifacts |

### Why this split (and why not the other splits)

- **Head of People, not "Chief People Officer."** At week-0 scale the
  role is operational — owning the context doc, calibrating voice,
  running the Monday readout — not strategic. CPO is too senior; "HR
  Manager" is too narrow. "Head of People" is the right shape.
- **Recruiter is one agent, not two (sourcer + closer).** Sourcing and
  closing is the same feedback loop for a solo founder with 3 open
  reqs. Splitting them creates ping-pong.
- **People Ops bundles helpdesk + onboarding + compliance.** Q&A,
  onboarding plans, and compliance calendar are the same primitive:
  read the shared policy canon, answer/draft/remind. One agent.
- **Performance & Retention bundled.** Retention risk is a downstream
  signal of performance feedback cycles. Splitting them means two
  agents fight over "who owns 1:1s." Bundle: one owner, one feedback
  loop.
- **We do NOT have** a Payroll/Benefits agent (that's HRIS/finance, out
  of scope), a Legal/Compliance agent (legal-sensitive drafts route to
  a human lawyer — philosophy §11), a Talent-Brand / Employer-Marketing
  agent (absorbed into Head of People's `synthesize-employer-brand`).
- **We do NOT split "HR helpdesk" from "People Ops."** In Gumloop's
  AskHR template they're the same thing. Building two agents here would
  duplicate the policy-canon reads for no role-coherence gain.

---

## Shared state: the people-context doc

All four agents read **one** shared markdown file owned by the Head of
People:

- Path (inside the workspace): `agents/head-of-people/people-context.md`
- Cross-agent read: `../head-of-people/people-context.md`

It contains (sections, in order):

1. **Company values** — 4–6 values with 1-line definitions.
2. **Team shape** — headcount by function, open reqs.
3. **Leveling framework** — IC + manager tracks with level names and
   summary expectations.
4. **Comp bands** — range per level, equity stance, location
   multipliers.
5. **Review-cycle rhythm** — annual/semi-annual/quarterly, next cycle
   date.
6. **Policy canon** — leave, benefits, expenses, remote work, travel,
   equipment. Links to source docs where they exist. `TBD` where they
   don't.
7. **Escalation rules** — what questions the agent answers directly vs
   what routes to the founder vs what routes to a human lawyer
   (discrimination · harassment · wage disputes · visa law · protected
   -class performance actions).
8. **Voice notes** — tone fingerprint for HR comms (offers, rejections,
   PIPs, terminations).
9. **Hard nos** — what the team will never do (e.g. "we never
   counter-offer on resignations," "we never publish salaries publicly,"
   "we always give 30-day notice before equity expirations").

**Rule baked into every non-HoP agent's `CLAUDE.md`:** "Before any
substantive output, read `../head-of-people/people-context.md`. If it's
empty or missing, tell the user to spend 5 minutes with the Head of
People first and stop."

The escalation-rules section is load-bearing for `people-ops.answer-policy-question` — the classifier for "does this need a human?" reads directly from that section.

---

## Per-agent skill lists

Each list is the final skill surface — `research/{agent-id}.md` may add a
line in edge cases but the shape is locked. Every agent also ships
`onboard-me` (mandatory per Philosophy §12).

### 1. Head of People — `head-of-people`

**Skills (5 + onboard-me):**

| Skill | Use case (README "First prompt") | Source |
|-------|----------------------------------|--------|
| `define-people-context` | "Set up our people context — values, leveling, comp, policies" | Coverage gap (solo-founder essential) |
| `draft-leveling-framework` | "Draft our leveling framework — IC + manager tracks, L1 through L5" | Coverage gap |
| `voice-calibration` | "Calibrate the HR voice from 10 past offers / messages" | Transfer from Support HoS |
| `synthesize-employer-brand` | "Synthesize what our team is saying publicly — Glassdoor, reviews, feedback" | Workplace Reputation Analyzer |
| `weekly-people-review` | "Give me the Monday people review — hires, flight risks, open reqs" | Transfer from Support HoS |

**Owns:** `people-context.md`, `employer-brand-briefs/{YYYY-MM-DD}.md`,
`leveling-drafts/{slug}.md`, `reviews/{YYYY-MM-DD}.md`.

### 2. Recruiter — `recruiter`

**Skills (7 + onboard-me):**

| Skill | Use case | Source |
|-------|----------|--------|
| `source-candidates` | "Find 20 candidates for the {role} req from {signal source}" | Hiring-market-scanner + OSS-contributor shape |
| `screen-resume` | "Screen this stack of resumes for the {role} req" | Resume Screening Agent |
| `score-candidate` | "Score this LinkedIn URL against our rubric for {role}" | Analyze LinkedIn Profile |
| `prep-interviewer` | "Prep me to interview {candidate} for {role}" | Interview Prep Agent (inverted) |
| `coordinate-interviews` | "Schedule and brief the panel for {candidate}'s loop" | Coverage gap |
| `debrief-loop` | "Synthesize the panel feedback for {candidate} — hire / no hire?" | Coverage gap |
| `draft-offer` | "Draft the offer letter for {candidate} at {level}" | Coverage gap (reads comp bands from `people-context.md`) |

**Owns:** `candidates/{slug}.md`, `reqs/{role-slug}.md`,
`interview-loops/{slug}.md`, `offers/{slug}.md`,
`sourcing-lists/{role-slug}-{YYYY-MM-DD}.md`.

### 3. People Ops — `people-ops`

**Skills (5 + onboard-me):**

| Skill | Use case | Source |
|-------|----------|--------|
| `answer-policy-question` | "Does {employee} qualify for {PTO / leave / reimbursement / equipment}?" | AskHR |
| `onboard-new-hire` | "Draft the first-90-days plan for {new hire} starting {date}" | Coverage gap |
| `employee-dossier` | "Pull everything we know about {employee} — tenure, recent 1:1s, role history" | Transfer from Support |
| `run-approval-flow` | "Review this {PTO request / comp change / promotion case} against our rubric" | Transfer from Ops |
| `compliance-calendar` | "Build the compliance calendar — I-9s, W-4s, visa renewals, review cycles" | Coverage gap + transfer from Ops vendor |

**Owns:** `policy-answers/{slug}.md`, `onboarding-plans/{new-hire-slug}.md`,
`dossiers/{employee-slug}.md`, `approvals/{slug}.md`,
`compliance-calendar.md`.

### 4. Performance & Retention — `performance-retention`

**Skills (5 + onboard-me):**

| Skill | Use case | Source |
|-------|----------|--------|
| `collect-checkins` | "Collect this week's 1:1 check-ins across the team" | Transfer from Ops `collect-updates` |
| `score-retention-risk` | "Score retention risk across the team — who's a flight risk?" | Transfer from Support/Success `score-customer-health` |
| `draft-stay-conversation` | "Draft a stay conversation for {employee} — they flagged RED" | Transfer from Support/Success `draft-churn-save` |
| `prep-review-cycle` | "Prep the Q{N} review cycle — self-review, manager-review, calibration" | Coverage gap |
| `draft-pip` | "Draft a PIP for {employee} — {performance concerns}" | Coverage gap (tone-sensitive) |

**Owns:** `checkins/{YYYY-MM-DD}.md`,
`retention-scores/{YYYY-MM-DD}.md`,
`stay-conversations/{employee-slug}.md`,
`review-cycles/{cycle-slug}.md`, `pips/{employee-slug}.md`.

---

## Gumloop → Houston mapping (from the consolidated catalog)

See `research/gumloop-hr-catalog-2026-04-23.md` for full per-template
analysis. Team-level mapping:

| Gumloop template | Agent | Skill | Verdict |
|------------------|-------|-------|---------|
| Resume Screening Agent | `recruiter` | `screen-resume` | NEW-SKILL |
| Analyze and score a candidate's LinkedIn profile | `recruiter` | `score-candidate` | NEW-SKILL |
| Prepare for a job interview (inverted) | `recruiter` | `prep-interviewer` | NEW-SKILL (shape only) |
| Rank candidates based on resumes | `recruiter` | `screen-resume` | ROLL-INTO |
| Find open source contributors | `recruiter` | `source-candidates` | NEW-SKILL (generalized) |
| Research open jobs (hiring-market-scanner) | `recruiter` + `head-of-people` | `source-candidates` + `synthesize-employer-brand` | ROLL-INTO |
| AskHR | `people-ops` | `answer-policy-question` | NEW-SKILL |
| Workplace Reputation Analyzer | `head-of-people` | `synthesize-employer-brand` | NEW-SKILL |
| Automated Job Application Assistant | — | — | SKIP (candidate-side) |
| Tailored Resume Generation | — | — | SKIP (candidate-side) |
| Tailored cover letter generator | — | — | SKIP (candidate-side) |
| Convert LinkedIn profile → resume | — | — | SKIP (candidate-side) |
| LinkedIn Job Scraper | — | — | SKIP (candidate-side) |

### Cross-vertical transfers (proven shapes, HR-adapted)

| Source shape | HR skill | Agent |
|--------------|----------|-------|
| `define-operating-context` (Ops) / `define-support-context` (Support) | `define-people-context` | `head-of-people` |
| `voice-calibration` (Support HoS) | `voice-calibration` | `head-of-people` |
| `weekly-support-review` (Support HoS) | `weekly-people-review` | `head-of-people` |
| `customer-dossier` (Support Inbox) | `employee-dossier` | `people-ops` |
| `run-approval-flow` (Ops HoO) | `run-approval-flow` | `people-ops` |
| `track-renewals` (Ops Vendor) | `compliance-calendar` | `people-ops` |
| `collect-updates` (Ops HoO) | `collect-checkins` | `performance-retention` |
| `score-customer-health` (Support Success) | `score-retention-risk` | `performance-retention` |
| `draft-churn-save` (Support Success) | `draft-stay-conversation` | `performance-retention` |

### Coverage gaps (invented from role knowledge)

- `draft-leveling-framework` — leveling ladders, IC + manager tracks
  (HoP).
- `onboard-new-hire` — first-90-days plan per hire (People Ops).
- `coordinate-interviews` — panel scheduling + interviewer brief
  (Recruiter).
- `debrief-loop` — panel-feedback synthesis into hire/no-hire decision
  memo (Recruiter).
- `draft-offer` — offer-letter drafting against comp bands (Recruiter).
- `prep-review-cycle` — self/manager/calibration templates per cycle
  (Perf&Ret).
- `draft-pip` — tone-sensitive PIP drafts (Perf&Ret).

---

## Build order (recommended)

Don't build all four in parallel — **Head of People ships first**
because the other three read its `people-context.md`.

1. **Head of People** first. Without the people-context doc, the others
   stop and ask for it. Ship HoP, have the founder run
   `define-people-context`, lock the doc.
2. **People Ops** second. Highest daily-use agent (policy Q&A,
   onboarding new hires) — start it early so founders get value fast.
3. **Recruiter** third. High-leverage when hiring is active; dormant
   otherwise. Start before the next open req.
4. **Performance & Retention** fourth. Highest-complexity skills
   (retention scoring, PIPs) but only activates with an existing team.
   Ship last but tight.

Each agent is built per the playbook:

1. The per-agent research MD at `research/{agent-id}.md` is the spec.
2. Build per `../BUILDING-A-VERTICAL.md` Phase 4 + this workspace's
   `BUILD-CONVENTIONS.md`.
3. Regenerate the Overview bundle via `scripts/generate_bundles.py`.

---

## Workspace conventions

- **Directory:** `hr-workspace/` (this dir).
- **Each agent is self-contained** — would work as a standalone install.
  Cross-agent reads are **only** for `people-context.md`.
- **Outputs are markdown, not JSON.** Every skill writes a markdown
  artifact. A JSON index (`outputs.json`) at each agent root tracks
  entries for the dashboard.
- **Dashboard:** hand-crafted IIFE per agent, read-only, generated from
  `scripts/bundle_template.js`.
- **Data paths never go under `.houston/<agent>/`.**
- **Legal-sensitive content always escalates.** People Ops'
  `answer-policy-question` and Performance & Retention's `draft-pip`
  both read the escalation rules from `people-context.md` and stop with
  a "this needs a human lawyer" note when triggered.

---

## What lives where (output tree after all four are built)

```
hr-workspace/
├── workspace.json
├── README.md                       # install + first prompts
├── TEAM-GUIDE.md                   # this file
├── BUILD-CONVENTIONS.md            # workspace-scoped build rules
├── LICENSE
├── .gitignore
├── research/
│   ├── gumloop-hr-catalog-2026-04-23.md
│   ├── head-of-people.md
│   ├── recruiter.md
│   ├── people-ops.md
│   └── performance-retention.md
├── scripts/
│   ├── bundle_template.js
│   └── generate_bundles.py
└── agents/
    ├── head-of-people/
    ├── recruiter/
    ├── people-ops/
    └── performance-retention/
```

---

## Done criteria for this guide

- [x] Team roster locked (4 agents named).
- [x] Per-agent skill list locked with use-case phrasings.
- [x] Gumloop signal + cross-vertical transfers + coverage gaps mapped.
- [x] Build order decided.
- [ ] Per-agent research MDs exist in `research/`.
- [ ] Agents are built under `agents/`.
- [ ] Dashboards generated, verified.
- [ ] Workspace shipped to public GitHub.
