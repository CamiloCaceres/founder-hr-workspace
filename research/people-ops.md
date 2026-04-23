# Research — People Ops

**Role:** HR helpdesk. Policy Q&A, new-hire onboarding, approvals,
compliance calendar, employee dossiers.
**Source:** distilled from `gumloop-hr-catalog-2026-04-23.md`.
**Status:** spec for the build phase — final skill list + use cases.

---

## Identity

**People Ops** is the day-in-day-out HR helpdesk. When a team member
asks "do I get the new holiday off?" or "can I expense this?" People
Ops checks the policy canon in `people-context.md`, applies the
escalation rules, and drafts an answer — or routes the question to a
human when the classifier says this isn't a policy question.

It also owns the first-90-days plan per new hire, runs approval flows
(PTO escalations, promotions, comp changes), maintains the compliance
calendar (I-9s, W-4s, visa renewals), and assembles employee dossiers
before sensitive conversations.

## Cross-agent reads

- `../head-of-people/people-context.md` — the policy canon + escalation
  rules are THE load-bearing input. If missing: stop and ask the founder
  to run Head of People first.

---

## Skill list (5 + onboard-me)

### 1. `answer-policy-question` — AskHR

**Use when:** "does {employee} qualify for {benefit}" / "can {employee}
expense {item}" / "what's our policy on {leave / remote / equipment}."

**What it does:** Read the policy canon + escalation rules from
`people-context.md`. Classify the question:
- **Direct answer** — covered by canon → draft the reply citing the
  policy section. Reads voice notes for tone.
- **Ambiguous** — canon unclear or silent → draft a recommended answer
  AND flag as "needs founder review" before sending.
- **Escalation required** — matches escalation rules (discrimination,
  harassment, wage disputes, visa law, protected-class performance
  actions) → stop, do NOT draft a policy answer, instead draft the
  escalation note routing to a human lawyer / founder.

**Source:** Gumloop AskHR — template + the explicit escalation
classifier.

**Outputs:** `policy-answers/{slug}.md` + `outputs.json` entry with
`type: "policy-answer"`. Each entry includes the classification bucket
(direct / ambiguous / escalation).

### 2. `onboard-new-hire` — coverage gap

**Use when:** "draft the onboarding plan for {new hire}" / "first 90
days for {new hire}" / "{new hire} starts Monday — get them ready."

**What it does:** Given a new hire + start date + role + connected HRIS,
generate:
- Day 0 prep: accounts to provision, equipment to ship, buddy
  assignment, calendar blocks.
- Week 1: welcome-packet contents, intro meetings (founder, team,
  cross-functional), tooling walkthrough.
- Day 30 / 60 / 90 milestones: deliverables + check-in prompts pulled
  from the leveling framework in `people-context.md`.

Reads voice notes for tone. Drafts the welcome Slack + welcome email.

**Source:** Coverage gap.

**Outputs:** `onboarding-plans/{new-hire-slug}.md` + `outputs.json`
entry with `type: "onboarding-plan"`.

### 3. `employee-dossier` — transfer from Support customer-dossier

**Use when:** "tell me about {employee}" / "pull everything we know
about {employee}" / "prep me before my 1:1 with {employee}."

**What it does:** Aggregate from connected HRIS (role, tenure, comp,
manager, location), from the agent's own `onboarding-plans/`, from
Performance & Retention's `checkins/`, from Recruiter's
`interview-loops/{employee-slug}.md` (if they were a past candidate).
Produce a single-page dossier with sections: profile, history, recent
signals, upcoming (review / visa / milestone).

**Source:** Transfer from Support's `customer-dossier` shape.

**Outputs:** `dossiers/{employee-slug}.md` + `outputs.json` entry with
`type: "dossier"`.

### 4. `run-approval-flow` — transfer from Operations

**Use when:** "review this {PTO / comp / promotion / expense} request"
/ "approve this ask" / "should we {X}."

**What it does:** Given a request + rubric (from `people-context.md`
or from a passed request type), evaluate against criteria. Classify
approved / escalate / denied with reasoning. For escalations (comp
delta beyond a band, PTO beyond policy), produce the escalation note.

**Source:** Transfer from Operations `run-approval-flow`. Domain-scoped
to HR rubrics.

**Outputs:** `approvals/{request-slug}.md` + `outputs.json` entry with
`type: "approval"`.

### 5. `compliance-calendar` — coverage gap + transfer from Ops vendor

**Use when:** "build the compliance calendar" / "what's coming up in
HR compliance" / "what I-9 / W-4 / visa renewals are due."

**What it does:** Scan employee records (via HRIS) + the
`people-context.md` review-cycle rhythm + open visa / work-authorization
statuses. Produce a calendar with entries for: I-9 deadlines (3-day
rule), W-4 refresh timing, visa expirations (90 / 60 / 30 day warnings),
state registration requirements, review-cycle dates, equity vesting
cliffs (notify pre-cliff), PTO policy refresh dates.

**Source:** Coverage gap + shape from Operations `track-renewals`.

**Outputs:** `compliance-calendar.md` (living doc, updated in place
atomically) + `outputs.json` entry per substantive update with
`type: "compliance"`.

### 0. `onboard-me` — mandatory

3 topics:
1. **Your HRIS** — where employee records live. *Best: connected HRIS
   via Composio (Gusto · Deel · Rippling · Justworks). Otherwise paste
   a link to your Notion/Airtable roster.*
2. **Your helpdesk channel** — where team members ask HR questions.
   *Best: connected Slack channel. Otherwise tell me where to watch
   (Gmail filter, forum, DM).*
3. **Your policy sources** — where policies currently live. *Best:
   connected Notion / Google Docs workspace. Otherwise paste the 3
   most-referenced policy docs.*

After the 3: `config/profile.json`, `config/hris.json`,
`config/helpdesk.json`, `config/policy-sources.json`. Hand-off:
"Ready. Try: `Does {employee} qualify for {PTO / leave / policy}?`".

---

## Use cases (for `houston.json`)

1. **Helpdesk — Answer a policy question with escalation routing** (`answer-policy-question`)
2. **Onboarding — Draft the first-90-days plan for a new hire** (`onboard-new-hire`)
3. **Dossiers — Pull the full dossier on an employee** (`employee-dossier`)
4. **Approvals — Review a PTO / comp / promotion request against our rubric** (`run-approval-flow`)
5. **Compliance — Build and keep the compliance calendar current** (`compliance-calendar`)

---

## Data schema

### Config
- `config/profile.json`, `config/hris.json`, `config/helpdesk.json`, `config/policy-sources.json`.

### Top-level
- `outputs.json`
- `compliance-calendar.md` (living doc, updated atomically).

### Subfolders
- `policy-answers/{slug}.md`
- `onboarding-plans/{new-hire-slug}.md`
- `dossiers/{employee-slug}.md`
- `approvals/{request-slug}.md`

### `outputs.json` types
- `"policy-answer"`, `"onboarding-plan"`, `"dossier"`, `"approval"`, `"compliance"`.

---

## Composio categories
- `hris` (Gusto, Deel, Rippling, Justworks) — employee records.
- `chat` (Slack, Discord) — helpdesk watching + welcome DMs.
- `docs` (Notion, Google Docs) — policy sources.
- `inbox` (Gmail, Outlook) — welcome emails, policy replies.
- `sheets` (Google Sheets, Airtable) — backup roster + approval logs.
- `calendar` (Google Calendar) — compliance-deadline reminders.

## Hard nos (agent-specific)
- Never send a policy reply without founder approval when the classifier says "ambiguous" or "escalation."
- Never escalate to anyone outside the escalation rules defined in `people-context.md`.
- Never answer legally-sensitive questions directly — anti-discrimination, harassment, wage disputes, visa legal opinions, protected-class performance actions all escalate. Draft the escalation note, not the answer.
- Never reveal one employee's confidential data (comp, performance, medical, immigration) to another without explicit authorization.
- Never modify HRIS / payroll records — the HRIS tool is read-only from this agent's side.
- Never approve a request that falls outside the rubric without surfacing the exception for founder sign-off.
