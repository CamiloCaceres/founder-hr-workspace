# Gumloop HR Catalog — Consolidated

**Date:** 2026-04-23
**Scraped by:** Claude Code session — cross-read of the five sibling verticals'
Gumloop catalogs (engineering, marketing, sales, support, operations) +
six direct template-body fetches on HR-tagged slugs.
**Sources:**
- `../engineering-workspace/research/gumloop-engineering-catalog-2026-04-22.md`
- `../founder-marketing-workspace/research/gumloop-marketing-catalog-2026-04-22.md`
- `../founder-sales-workspace/research/gumloop-sales-catalog-2026-04-23.md`
- `../solo-support-workspace/research/gumloop-support-catalog-2026-04-22.md`
- `../operations-workspace/research/operations/2026-04-22-gumloop.md`
- Six individual `/templates/{slug}` WebFetches for HR-tagged templates.

**Scope locked in Phase 0:**

- **Audience:** solo founder, week 0 of formal people ops. They've made or
  are about to make their first 1–5 hires (full-time, contractor, or
  fractional). No HR person. No recruiter on retainer. They're doing
  screening, onboarding, policy answers, retention, and their first
  performance cycle themselves.
- **Existing tools:** Google Workspace + Slack + a payroll/HRIS (Gusto ·
  Deel · Rippling · Justworks). Maybe an ATS (Ashby · Greenhouse · Lever
  · Workable). Offers and contracts in Google Docs. No handbook yet.
- **Done line:** *"The founder can run weekly people ops — screen
  candidates, onboard hires, answer team policy questions, catch
  retention risk, prep review cycles — without a human HR-person in the
  loop for that function."*
- **Explicitly excluded** (scope coherence per Philosophy §10):
  - Payroll processing, benefits enrollment, tax filings — HRIS/finance.
  - Candidate-side tools (resume gen, cover letters, job hunting) —
    serves the job-seeker, not the HR team.
  - Legal-sensitive drafts (anti-discrimination investigations, severance
    negotiation, visa law) — routes to a human lawyer.

---

## Scrape reality check

**There is no `/templates/solutions/hr` page on Gumloop.** WebFetch 404s on
`/solutions/hr`, `/solutions/human-resources`, `/solutions/recruiting`,
`/solutions/people`. HR-adjacent templates live scattered across the
Operations category (which explicitly tags HR as out-of-scope and lists 12
HR templates as SKIPs) plus a handful cross-listed in Engineering and
Sales. The Operations catalog is the de facto HR index.

**Total HR-adjacent templates surfaced: 13 unique slugs.** Of those, six
bodies were fetched end-to-end; seven have slugs that either 404'd on
reasonable guesses or are referenced by title only in sibling catalogs
(future Chrome-based scrape would resolve them, but the existing signal is
strong enough to proceed).

Key observation that shaped the scope: **~50% of the HR-tagged templates
are candidate-side personal tools** (resume gen, cover letters, interview
prep, job hunting). These are out of scope for an HR-team vertical and are
all SKIPped below.

---

## Templates — master mapping

Verdict key: `NEW-SKILL` · `NEW-USE-CASE` (on an existing skill) ·
`ROLL-INTO` · `SKIP`. Tools named in template titles are stripped in the
Houston mapping per the playbook — Composio is our transport.

### Employer-side recruiting templates

#### 001 — Resume Screening Agent

- **Source:** `/templates/resume-screening-agent` · Adel Wu · 146 views · 2026-04-14.
- **Workflow shape:**
  - **Inputs:** Resume files (PDF/DOC in cloud storage or uploaded).
  - **Transform:** Parse resume with a doc processor; extract structured candidate data against a job criteria list; classify pass/fail; post summary to Slack.
  - **Outputs:** Structured candidate record + pass/fail signal + Slack notification.
- **Tools named (not copied):** Ashby, Reducto, Slack, Web Search.
- **Houston mapping:**
  - **Primitive skill:** `screen-resume` — `NEW-SKILL`.
  - **Use case:** "Screen the stack of resumes for the {role} req against our rubric."
  - **Belongs in role:** `recruiter`.
  - **Verdict:** `NEW-SKILL`.

#### 002 — Analyze and score a candidate's LinkedIn profile

- **Source:** `/templates/analyze-and-score-a-candidates-linkedin-profile` · Jyoti Swain · 2.6k views · 2025-11-11.
- **Workflow shape:**
  - **Inputs:** LinkedIn profile URL + scoring criteria (experience, location, seniority, education). Optional routing destination.
  - **Transform:** Scrape profile → AI evaluates against criteria → produce 0–100 score + background summary.
  - **Outputs:** Candidate score, background summary, optionally routed to Docs / Sheets / Airtable / Slack / email.
- **Houston mapping:**
  - **Primitive skill:** `score-candidate` — `NEW-SKILL`.
  - **Use case:** "Score {LinkedIn URL} against our rubric for the {role} req."
  - **Belongs in role:** `recruiter`.
  - **Verdict:** `NEW-SKILL`.
  - **Note:** Highest views of any HR-tagged template — strongest real-user-demand signal in the catalog.

#### 003 — Prepare for a job interview

- **Source:** `/templates/prepare-for-a-job-interview` · Jyoti Swain · 2.5k views · 2025-11-14.
- **Workflow shape:**
  - **Inputs:** Job posting URL + candidate LinkedIn URL.
  - **Transform:** Analyze posting vs candidate profile → generate prep report.
  - **Outputs:** Candidate-side interview prep report (via email optional).
- **Houston mapping:**
  - **Primitive skill:** `prep-interviewer` — `NEW-SKILL` (**inverted**).
  - **Use case:** "Prep me to interview {candidate} for the {role} req — likely questions, red flags, reference themes."
  - **Belongs in role:** `recruiter`.
  - **Verdict:** `NEW-SKILL` (shape inversion — flip candidate-side prep into interviewer-side prep given role + candidate profile).

#### 004 — Rank candidates based on resumes

- **Source:** referenced in Operations catalog #031 (slug not resolved during this scrape — WebFetch 404'd common guesses).
- **Workflow shape (inferred from catalog):** N resumes + job criteria → ranked list.
- **Houston mapping:**
  - **Verdict:** `ROLL-INTO screen-resume`. Batch variant of the same primitive. The single-resume and multi-resume cases are one skill with two use cases.

#### 005 — LinkedIn Job Scraper

- **Source:** referenced in Operations catalog #045 (slug not resolved).
- **Workflow shape:** job-URL → structured fields.
- **Houston mapping:**
  - **Verdict:** `SKIP` — candidate-side job hunting. Out of scope.

#### 006 — Find open source contributors

- **Source:** referenced in Operations catalog #046 (slug not resolved).
- **Workflow shape:** sourcing engineers from public OSS activity.
- **Houston mapping:**
  - **Primitive skill:** `source-candidates` (sourcing from public signal).
  - **Use case:** "Find 20 candidates for {role} based on {signal — GitHub, LinkedIn, community activity}."
  - **Belongs in role:** `recruiter`.
  - **Verdict:** `NEW-SKILL` (generalized beyond OSS — any public-signal sourcing).

#### 007 — Research open jobs (hiring-market-scanner)

- **Source:** referenced in Operations catalog #035 (slug not resolved).
- **Workflow shape:** scan open reqs at peer companies.
- **Houston mapping:**
  - **Verdict:** `ROLL-INTO` the recruiter's `source-candidates` + HoP's `synthesize-employer-brand` (the "what are comp peers paying / hiring for" signal). Not a dedicated skill.

### Employee-facing / HR-ops templates

#### 008 — AskHR — Get instant answers to HR and policy questions

- **Source:** `/templates/askhr-get-instant-answers-to-hr-and-policy-questions-without-the-back-and-forth` · Adejoke (JK) Adekunle · 2.3k views · 2026-02-01.
- **Workflow shape:**
  - **Inputs:** Employee Slack question + company HR policy knowledge base.
  - **Transform:** Query KB → classify whether the question needs human judgment (complaints, grievances, sensitive matters) → route to HR personnel if escalation, else answer directly.
  - **Outputs:** Policy answer, or escalation route + resource recommendation for non-policy issues.
- **Tools named:** Airtable (KB), Slack (interface).
- **Houston mapping:**
  - **Primitive skill:** `answer-policy-question` — `NEW-SKILL`.
  - **Use case:** "Does {employee} qualify for {PTO / parental leave / reimbursement / equipment / remote work}? Draft the answer."
  - **Belongs in role:** `people-ops`.
  - **Verdict:** `NEW-SKILL`.
  - **Critical design note:** The explicit escalation-routing logic (sensitive-matters classifier) is load-bearing. People Ops encodes escalation rules in the shared `people-context.md` and reads them before answering. This is the same shape as Support's SLA watchdog + tone-sensitive `draft-reply`.

#### 009 — Workplace Reputation Analyzer

- **Source:** `/templates/workplace-reputation-analyzer` · JK Adekunle · 2.3k views · 2025-11-28.
- **Workflow shape:**
  - **Inputs:** Glassdoor API reviews, date range, employee segment filters.
  - **Transform:** Process and synthesize review data.
  - **Outputs:** Aggregated summaries, key insights report, leadership notifications.
- **Tools named:** Glassdoor API, Ask AI, Google Docs Writer, Slack Message Sender.
- **Houston mapping:**
  - **Primitive skill:** `synthesize-employer-brand` — `NEW-SKILL`.
  - **Use case:** "Synthesize what our team is actually saying publicly — Glassdoor + connected review sources — into a leadership readout."
  - **Belongs in role:** `head-of-people`.
  - **Verdict:** `NEW-SKILL`. Generalize beyond Glassdoor — any connected review or survey source via Composio.

### Candidate-side / personal tools

#### 010 — Automated Job Application Assistant

- **Source:** `/templates/automated-job-application-assistant` · JP (Joel Parfait) · 648 views · 2025-11-26.
- **Workflow shape:** Personal info + employer emails → tailored cover letter → auto-send.
- **Verdict:** `SKIP` — candidate-side. Out of scope.

#### 011 — Tailored Resume Generation with AI and PDF Generator

- **Source:** referenced in Operations catalog #010 (slug not resolved).
- **Verdict:** `SKIP` — candidate-side.

#### 012 — Tailored cover letter generator

- **Source:** referenced in Operations catalog #033 (slug not resolved).
- **Verdict:** `SKIP` — candidate-side.

#### 013 — Convert LinkedIn profile into resume

- **Source:** referenced in Operations catalog #034 (slug not resolved).
- **Verdict:** `SKIP` — candidate-side.

---

## Cross-vertical shape transfers

These are patterns proven in sibling verticals that map cleanly to HR
workflows. Each is a **NEW-SKILL** in the HR workspace; the shape is
borrowed, the artifact and the agent boundary are HR-specific.

| Shape (source vertical) | HR skill | Agent | Why it transfers |
|-------------------------|----------|-------|------------------|
| `run-approval-flow` (Operations #011) | `run-approval-flow` | `people-ops` | Hiring decisions, promotion approvals, PTO escalations, expense review — classic rubric-driven approval. |
| `customer-dossier` (Support/Inbox) | `employee-dossier` | `people-ops` | Pull profile + history + tenure + recent 1:1s before a conversation. |
| `score-customer-health` / `draft-churn-save` (Support/Success) | `score-retention-risk` / `draft-stay-conversation` | `performance-retention` | Sentiment + engagement + 1:1 recency → flight-risk flag + save-outreach draft. **Highest-leverage transfer** — early-hire retention is where solo founders bleed. |
| `collect-updates` (Operations #021 — weekly OKR alignment) | `collect-checkins` | `performance-retention` | Weekly 1:1 prompts, review-cycle collection, performance check-ins. Almost zero modification. |
| `weekly-support-review` (Support HoS) | `weekly-people-review` | `head-of-people` | Headcount changes, hiring pipeline, open reqs, flight-risk flags, upcoming review dates. |
| `voice-calibration` (Support HoS) | `voice-calibration` | `head-of-people` | HR voice for sensitive comms — PIPs, offers, rejections, terminations. |
| `define-support-context` / `company-operating-context` (Support · Ops) | `define-people-context` | `head-of-people` | The shared doc: values, leveling framework, comp bands, policies, hard nos. **The coordinator's reason to exist.** |
| `build-battlecard` (Sales AE) | `build-offer-battlecard` | `recruiter` (absorbed into `draft-offer`) | Counter-offer comps, candidate's current package, likely objections. Not a standalone skill — a use case on `draft-offer`. |
| `capture-call-notes` (Sales AE) | interview-notes use case | `recruiter` (absorbed into `prep-interviewer`) | Structured interview rubric capture. Not standalone. |
| `track-renewals` (Operations vendor) | `compliance-calendar` | `people-ops` | I-9 · W-4 · visa renewals · state registrations · review-cycle dates. |

---

## Coverage gaps (invented from role knowledge, not on Gumloop)

Gumloop's HR surface is thin (no dedicated category) and skews
candidate-side. The bulk of the vertical's skill surface is
coverage-gap-driven — consistent with the pattern in Support and
Operations.

| Gap | Owner | Skill | Why invented |
|-----|-------|-------|--------------|
| The shared `people-context.md` doc | `head-of-people` | `define-people-context` | Values, leveling framework, comp bands, policies, escalation rules, hard nos. The single highest-leverage artifact in the workspace — every other agent reads it. |
| Leveling / comp framework drafting | `head-of-people` | `draft-leveling-framework` | The founder's first-ever attempt at "what's an L3 vs L4" or "what's the IC3 comp band." Gumloop has zero. |
| First-90-days onboarding plan per hire | `people-ops` | `onboard-new-hire` | Welcome packet, week-1 agenda, 30-60-90 milestones, buddy assignments. Solo founders do this ad hoc the first few times and then regret it. |
| Interview loop coordination | `recruiter` | `coordinate-interviews` | Schedule across panel, brief interviewers, collect feedback, debrief ready. |
| Offer-letter drafting | `recruiter` | `draft-offer` | Generate offer-letter language with comp band, equity, start date, contingencies. Reads `people-context.md` for comp ranges. |
| Loop debrief & decision-ready summary | `recruiter` | `debrief-loop` | Aggregate panel feedback into a decision memo (hire/no-hire + rationale). |
| Review-cycle prep | `performance-retention` | `prep-review-cycle` | Build the review-cycle artifacts: self-review template, manager-review template, calibration doc. |
| PIP drafting | `performance-retention` | `draft-pip` | Performance-Improvement-Plan drafts when a manager flags an IC. Tone-sensitive; reads `voice.md` + `people-context.md` for escalation rules. |
| Compliance calendar | `people-ops` | `compliance-calendar` | I-9 deadlines, W-4 refreshes, visa renewals, state-registration dates, review-cycle dates. |

---

## Roll-up by agent (skill counts)

| Agent | Gumloop-seeded skills | Shape-transfer skills | Coverage-gap skills | Total (excl. `onboard-me`) |
|-------|----------------------|----------------------|---------------------|---------------------------|
| `head-of-people` | 1 (`synthesize-employer-brand`) | 2 (`voice-calibration`, `weekly-people-review`) | 2 (`define-people-context`, `draft-leveling-framework`) | 5 |
| `recruiter` | 3 (`screen-resume`, `score-candidate`, `prep-interviewer`) + `source-candidates` (generalized) = 4 | 0 | 3 (`coordinate-interviews`, `draft-offer`, `debrief-loop`) | 7 |
| `people-ops` | 1 (`answer-policy-question`) | 3 (`run-approval-flow`, `employee-dossier`, `compliance-calendar`) | 1 (`onboard-new-hire`) | 5 |
| `performance-retention` | 0 | 3 (`collect-checkins`, `score-retention-risk`, `draft-stay-conversation`) | 2 (`prep-review-cycle`, `draft-pip`) | 5 |

**Total: 22 work skills + 4 × `onboard-me` = 26 SKILL.md files across four agents.**

Signal ratio: **5 direct Gumloop seeds + 8 cross-vertical shape transfers + 9 coverage-gap inventions = 22 skills.** Consistent with the ~50/50 signal-to-gap pattern across every other vertical.

---

## Skips with reasons

| Template | Reason |
|----------|--------|
| Automated Job Application Assistant | Candidate-side; serves the job-seeker. |
| Tailored Resume Generation w/ AI + PDF | Candidate-side. |
| Tailored cover letter generator | Candidate-side. |
| Convert LinkedIn profile → resume | Candidate-side. |
| LinkedIn Job Scraper | Candidate-side job hunting. |
| Prepare for a job interview (as-is) | Candidate-side — **shape inverted** to `prep-interviewer` (employer-side). Template is SKIP; shape is NEW-SKILL. |
| Research open jobs | Candidate-side; sourcing slice absorbed into `source-candidates` + employer-brand synthesis. |

---

## Hand-off

This catalog is the shared source for:

1. **`TEAM-GUIDE.md`** — argues the 4-agent roster, locks the coordinator
   pattern (Head of People owns `people-context.md`), maps templates +
   coverage gaps to per-agent skill lists.
2. **`research/{agent-id}.md`** (one per agent) — consumes the relevant
   subset, produces final skill lists and use-case tables the build phase
   consumes.

The build phase does not re-scrape. It reads `TEAM-GUIDE.md` and the
per-agent research MDs and builds.
