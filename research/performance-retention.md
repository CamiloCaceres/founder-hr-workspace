# Research — Performance & Retention

**Role:** The 1:1 rhythm, retention-risk scoring, review-cycle artifacts,
PIP drafting.
**Source:** distilled from `gumloop-hr-catalog-2026-04-23.md`.
**Status:** spec for the build phase — final skill list + use cases.

---

## Identity

**Performance & Retention** runs the feedback loop: collect weekly
check-ins, score retention risk from signal fusion, draft the stay
conversation when someone's about to churn, prep the quarterly review
cycle, draft the PIP when a manager flags an IC. Tone-sensitive
skills — this agent reads `people-context.md` voice notes before every
draft.

**Highest-leverage agent for a solo-founder stage company.** Early hire
retention is where founders bleed; catching flight risk 90 days before
someone resigns is worth more than any hiring skill.

## Cross-agent reads

- `../head-of-people/people-context.md` — values, voice, review-cycle
  rhythm, escalation rules. If missing: stop.
- `../people-ops/dossiers/{employee-slug}.md` (optional) — if an
  employee dossier exists, read it for context before tone-sensitive
  drafts.

---

## Skill list (5 + onboard-me)

### 1. `collect-checkins` — transfer from Ops collect-updates

**Use when:** "collect this week's check-ins" / "1:1 status across the
team" / "who's been quiet."

**What it does:** Per the team roster (from connected HRIS), send a
check-in prompt to each team member via connected Slack (default prompt
pulled from `people-context.md` or overridable). Collect responses.
Summarize: who responded, who's quiet, themes (wins · blockers ·
concerns), any escalation-flagged responses.

**Source:** Transfer from Operations `collect-updates` — retuned for
HR check-ins rather than OKR updates.

**Outputs:** `checkins/{YYYY-MM-DD}.md` + `outputs.json` entry with
`type: "checkin"`.

### 2. `score-retention-risk` — transfer from Support/Success score-customer-health

**Use when:** "score retention risk" / "who's a flight risk" / "check
team health."

**What it does:** For each team member, fuse signals:
- **Engagement:** 1:1 check-in responsiveness trend, Slack activity
  trend, PR / commit cadence (via connected engineering tools).
- **Sentiment:** check-in response tone, cross-team mentions,
  anonymous-feedback mentions.
- **Tenure & milestones:** approaching cliff vesting, post-promotion
  honeymoon, recent manager change.
- **Comp exposure:** time since last comp review, gap vs market (if
  `people-context.md` has comp bands).

Classify GREEN / YELLOW / RED per team member. For RED flags, surface
the specific signal combination and recommend `draft-stay-conversation`.

**Source:** Transfer from Support/Success `score-customer-health`.
HR-adapted — the signal sources are HR-native.

**Outputs:** `retention-scores/{YYYY-MM-DD}.md` + `outputs.json` entry
with `type: "retention-score"`.

### 3. `draft-stay-conversation` — transfer from Support/Success draft-churn-save

**Use when:** "draft a stay conversation for {employee}" / "someone
flagged RED — what do I say" / "{employee} might be leaving."

**What it does:** Given an employee + their RED flag signals + their
dossier, draft a 1:1 script (NOT an email — this is a verbal
conversation prompt). Structure: open → listen → surface (what the
agent noticed without accusing) → ask (what would make you stay) →
propose (concrete levers the founder can pull — comp, scope, title,
project). Reads `people-context.md` for voice + hard-no constraints
(e.g. "we never counter-offer on resignations").

**Source:** Transfer from Support/Success `draft-churn-save`.

**Outputs:** `stay-conversations/{employee-slug}.md` + `outputs.json`
entry with `type: "stay-conversation"`.

### 4. `prep-review-cycle` — coverage gap

**Use when:** "prep the review cycle" / "build the review templates"
/ "Q{N} reviews are starting — set me up."

**What it does:** Given the review-cycle rhythm from
`people-context.md` (annual / semi-annual / quarterly) + the current
team roster, produce:
- **Self-review template** — scoped to the leveling framework.
- **Manager-review template** — scoped to the leveling framework +
  review-cycle rubric.
- **Calibration doc** — cross-team view for leveling consistency,
  comp-bumps sanity check, promotion candidates surface.
- **Timeline** — self-reviews due → manager-reviews due → calibration
  meeting → comp-letters → delivery conversations.

**Source:** Coverage gap. Reads leveling from shared doc.

**Outputs:** `review-cycles/{cycle-slug}.md` (one file per cycle, e.g.
`review-cycles/2026-q2.md`) + `outputs.json` entry with
`type: "review-cycle"`.

### 5. `draft-pip` — coverage gap

**Use when:** "draft a PIP for {employee}" / "performance improvement
plan for {employee}" / "{manager} flagged {employee} for performance
concerns."

**What it does:** Given employee + performance concerns + recent
check-ins + dossier, draft the PIP. Structure:
- Context (what's underperforming, with specific examples).
- Expectations (what "meeting the bar" looks like, tied to leveling).
- Milestones (30 / 60 / 90 day checkpoints with measurable criteria).
- Support (what the founder / manager will provide).
- Consequences (what happens if milestones aren't met).

**CRITICAL ESCALATION CHECK:** Before drafting, read the escalation
rules from `people-context.md`. If the employee is in a protected class
and the concerns could be interpreted as pretextual, escalate to a
human lawyer — do NOT draft the PIP. Example trigger: "concerns arose
within 30 days of a medical leave request" → escalate.

Reads voice notes carefully — PIPs are the most tone-sensitive document
the HR vertical produces.

**Source:** Coverage gap. Escalation logic reads from shared doc.

**Outputs:** `pips/{employee-slug}.md` + `outputs.json` entry with
`type: "pip"`. Includes the escalation-classification (drafted /
blocked-on-escalation / needs-lawyer).

### 0. `onboard-me` — mandatory

3 topics:
1. **Your team roster** — who do we run check-ins for? *Best: connected
   HRIS via Composio. Otherwise paste a list of names + roles.*
2. **Your check-in rhythm** — weekly / biweekly / monthly? Where are
   responses collected? *Best: connected Slack channel. Otherwise
   paste.*
3. **Your review-cycle rhythm** — annual / semi-annual / quarterly,
   next cycle date? *Paste a line, or I'll read `people-context.md`'s
   review-cycle section if it's filled in.*

After the 3: `config/profile.json`, `config/roster.json`,
`config/checkin-rhythm.json`, `config/review-cycle.json`. Hand-off:
"Ready. Try: `Collect this week's check-ins across the team`."

---

## Use cases (for `houston.json`)

1. **Rhythm — Collect this week's 1:1 check-ins across the team** (`collect-checkins`)
2. **Retention — Score retention risk across the team** (`score-retention-risk`)
3. **Retention — Draft a stay conversation for someone flagged RED** (`draft-stay-conversation`)
4. **Reviews — Prep the Q{N} review cycle** (`prep-review-cycle`)
5. **Tough calls — Draft a PIP with escalation check** (`draft-pip`)

---

## Data schema

### Config
- `config/profile.json`, `config/roster.json`, `config/checkin-rhythm.json`, `config/review-cycle.json`.

### Top-level
- `outputs.json`

### Subfolders
- `checkins/{YYYY-MM-DD}.md`
- `retention-scores/{YYYY-MM-DD}.md`
- `stay-conversations/{employee-slug}.md`
- `review-cycles/{cycle-slug}.md`
- `pips/{employee-slug}.md`

### `outputs.json` types
- `"checkin"`, `"retention-score"`, `"stay-conversation"`, `"review-cycle"`, `"pip"`.

---

## Composio categories
- `hris` (Gusto, Deel, Rippling) — team roster.
- `chat` (Slack, Discord) — check-in prompts + responses.
- `inbox` (Gmail, Outlook) — review-cycle comms.
- `engineering` (GitHub, Linear, Jira) — optional signal source for PR / commit / ticket cadence used by `score-retention-risk`.
- `docs` (Notion, Google Docs) — review-cycle artifact delivery.
- `sheets` (Google Sheets) — retention-score tracking.

## Hard nos (agent-specific)
- Never send a stay conversation as-is — it's a prompt for a verbal 1:1, not an email. Always hand off to the founder with "here's the script — don't send it."
- Never deliver a PIP without founder sign-off. PIPs are drafts only.
- Never draft a PIP for a protected-class employee whose performance concerns trigger the escalation rules — stop and route to a human lawyer.
- Never share individual retention scores outside the founder → team-lead chain. Never post RED flags in public channels.
- Never modify HRIS / payroll — read-only.
- Never publish review-cycle artifacts until the founder has approved the cycle structure.
