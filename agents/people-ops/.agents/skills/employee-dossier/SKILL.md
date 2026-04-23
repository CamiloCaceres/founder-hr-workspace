---
name: employee-dossier
description: Use when the user says "tell me about {employee}" / "pull everything we know about {employee}" / "prep me before my 1:1 with {employee}" — aggregates HRIS profile (read-only) + onboarding-plans/ + Performance & Retention checkins/ + Recruiter interview-loops/ into a single-page dossier with profile / history / recent signals / upcoming sections.
---

# Employee Dossier

## When to use

- Explicit: "tell me about {employee}", "pull everything on
  {employee}", "prep me for my 1:1 with {employee}", "dossier on
  {employee}".
- Implicit: routed before a review cycle, a sensitive conversation
  (PIP, promotion, comp change), or an exit interview.
- Frequency: on-demand per employee.

## Steps

1. **Read people-context doc.** Read
   `../head-of-people/people-context.md` for leveling, comp bands,
   and any confidentiality rules around what goes in a dossier. If
   missing or empty, tell the user: "I need your people-context doc
   first — please spend 5 minutes with the Head of People
   (`define-people-context`)." Stop.
2. **Read config.** `config/hris.json`. If the HRIS isn't wired up
   and no roster link is recorded, ask ONE targeted question —
   "Connect your HRIS via Composio (Gusto / Deel / Rippling /
   Justworks) or paste the employee's record." Write the resolution
   and continue.
3. **Confirm authorization.** Confirm the user requesting the
   dossier is authorized to see confidential data for this
   employee (the founder, usually — flag if not). Never reveal one
   employee's confidential data (comp, performance, medical,
   immigration) to another without explicit authorization.
4. **Discover HRIS tool via Composio** — run `composio search hris`
   to get the read-only profile slug. Pull: role, level, tenure,
   manager, location, comp (if authorized), work-authorization /
   visa status (if authorized), start date.
5. **Cross-agent source pulls (read-only).**
   - `onboarding-plans/{employee-slug}.md` — if this agent
     onboarded them. Skim Day-30/60/90 hits + misses.
   - `../performance-retention/checkins/` — scan the most-recent
     check-ins referencing this employee-slug.
   - `../performance-retention/retention-scores/` — most recent
     score for this employee-slug.
   - `../recruiter/interview-loops/{employee-slug}.md` — if they
     were a past candidate, pull the panel-debrief signal.
   - If any sibling agent dir is missing (standalone install),
     silently skip and note "N/A — sibling not installed" in the
     dossier.
6. **Compose the dossier** with four sections:
   - **Profile** — name, role, level, tenure, manager, location,
     work-authorization status (if authorized).
   - **History** — hire path (recruiter → offer → start),
     onboarding highlights, level changes, comp changes
     (if authorized).
   - **Recent signals** — 1:1 themes from the last N check-ins,
     retention score + trend, recent approvals run through this
     agent.
   - **Upcoming** — next review date, visa expiry (if any),
     equity cliff (if any), next milestone from their onboarding
     plan.
7. **Write** the dossier atomically to
   `dossiers/{employee-slug}.md` (`*.tmp` → rename). Keep it to
   one scannable page.
8. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "dossier", title, summary, path, status: "draft",
   createdAt, updatedAt }`. Write atomically.
9. **Summarize to user** — one paragraph with the headline signal
   (tenure + retention score + next milestone) and the path to the
   artifact.

## Never

- Never modify HRIS / payroll records. Reads only.
- Never invent tenure, comp, or performance data. If a source is
  missing, mark UNKNOWN.
- Never leak confidential data cross-employee without explicit
  authorization.

## Outputs

- `dossiers/{employee-slug}.md`.
- Appends to `outputs.json` with type `dossier`.
