# People Ops — Data Schema

All records share these base fields:

```ts
interface BaseRecord {
  id: string;          // UUID v4
  createdAt: string;   // ISO-8601 UTC
  updatedAt: string;   // ISO-8601 UTC
}
```

All writes are atomic: write to a sibling `*.tmp` file, then rename
onto the target path. Never edit in-place. Never write anywhere under
`.houston/<agent>/` — the Houston file watcher skips those paths and
reactivity breaks.

---

## Cross-agent read

Before any substantive output, this agent reads
`../head-of-people/people-context.md` — the shared values / leveling
/ comp bands / review rhythm / policy canon / escalation rules /
voice notes / hard nos doc owned by the Head of People. If missing
or empty, skills tell the user to run the Head of People's
`define-people-context` first and stop.

The **escalation rules** section is the load-bearing input for
`answer-policy-question`. The classifier reads it before every run.
The **policy canon** and **voice notes** sections drive direct-answer
drafts. The **leveling framework** drives `onboard-new-hire` and
`employee-dossier`. The **review-cycle rhythm** drives
`compliance-calendar`.

---

## `config/` — what the agent learns about the user

Nothing under `config/` is shipped. Every file appears at runtime,
written by `onboard-me` or by progressive capture inside another
skill the first time it needs the value. `config/` is per-install
state and is gitignored.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  onboardedAt: string;        // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/hris.json` — written by `onboard-me`

```ts
interface Hris {
  provider?: "gusto" | "deel" | "rippling" | "justworks" | "other";
  connectedViaComposio: boolean;
  rosterLink?: string;         // fallback link (Notion / Airtable / sheet)
  source: "connected-hris" | "url" | "paste";
  capturedAt: string;
}
```

### `config/helpdesk.json` — written by `onboard-me`

```ts
interface Helpdesk {
  channelKind?: "slack" | "discord" | "gmail-filter" | "forum" | "dm" | "other";
  connectedViaComposio: boolean;
  channelRef?: string;         // e.g. "#ask-hr" or a Gmail filter label
  notes?: string;
  capturedAt: string;
}
```

### `config/policy-sources.json` — written by `onboard-me`

```ts
interface PolicySources {
  docsCategory?: "notion" | "google-docs" | "other";
  connectedViaComposio: boolean;
  keyDocs?: string[];          // up to 3 most-referenced policy doc URLs
  source: "connected-docs" | "url" | "paste";
  capturedAt: string;
}
```

---

## Top-level files at agent root

### `outputs.json`

Index of every deliverable this agent has produced. Read by the
dashboard; seeded to `[]` via `agentSeeds`.

```ts
interface Output {
  id: string;          // uuid v4
  type: "policy-answer" | "onboarding-plan" | "dossier" | "approval"
      | "compliance";
  title: string;
  summary: string;     // 2-3 sentences — the conclusion of this artifact
  path: string;        // relative to agent root
  status: "draft" | "ready";
  createdAt: string;   // ISO-8601
  updatedAt: string;   // ISO-8601
}
```

Rules:
- On update, refresh `updatedAt`, never touch `createdAt`.
- Never overwrite the array — read, merge, write atomically.
- Mark `draft` while iterating; flip to `ready` on founder sign-off.

For `policy-answer` entries, the summary records the classification
bucket — `direct` / `ambiguous` / `escalation`.

### `compliance-calendar.md` (living document, root)

Single living markdown doc maintained at the agent root (NOT in a
subfolder). One section per deadline category — I-9 deadlines (3-day
rule), W-4 refresh timing, visa expirations (90 / 60 / 30 day
warnings), state registration requirements, review-cycle dates,
equity vesting cliffs, PTO policy refresh dates. Updated atomically
in place (`compliance-calendar.md.tmp` → rename) each time
`compliance-calendar` runs. Each substantive update appends one new
`outputs.json` entry with `type: "compliance"`; the file itself is
overwritten atomically with the latest full calendar.

---

## Topic subfolders (markdown files)

Each output's full document is a markdown file under a topic
subfolder at the agent root. The subfolder is created on first use.

| Subfolder             | Written by              | Contents                                                                              | `type`            |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------- | ----------------- |
| `policy-answers/`     | `answer-policy-question`| `{slug}.md` — policy reply OR escalation note, with the classification bucket noted.  | `policy-answer`   |
| `onboarding-plans/`   | `onboard-new-hire`      | `{new-hire-slug}.md` — Day 0 / Week 1 / 30-60-90 plan + welcome drafts.               | `onboarding-plan` |
| `dossiers/`           | `employee-dossier`      | `{employee-slug}.md` — profile / history / recent signals / upcoming.                 | `dossier`         |
| `approvals/`          | `run-approval-flow`     | `{request-slug}.md` — classification (approved / escalate / denied) + reasoning.      | `approval`        |

Filenames are kebab-case; dates are ISO (`YYYY-MM-DD`).

---

## Classification recording — `answer-policy-question`

Every `policy-answers/{slug}.md` file records the classification at
the top of the file in a YAML-style frontmatter block or a bold
header line, and the `outputs.json` summary echoes it. Possible
values:

- `direct` — covered by policy canon; drafted reply cites the policy
  section. Safe to send after founder review.
- `ambiguous` — canon is silent or unclear; drafted reply is a
  recommendation, flagged as "needs founder review" before sending.
- `escalation` — matches the escalation rules; no policy answer is
  drafted. Instead, the file contains an escalation note routing to
  the named human (founder / human lawyer) per the rules in
  `people-context.md`.

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON
  readable by the dashboard. The living `compliance-calendar.md` is
  updated atomically too — write `.tmp`, rename over the existing
  file.
- IDs are uuid v4.
- Timestamps are ISO-8601.
- Updates mutate `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in-place — read the existing array, append
  or update in memory, write atomically.
- HRIS reads are read-only. This agent never mutates HRIS / payroll
  records under any circumstance.
- Never write under `.houston/<agent>/` (the seeded
  `.houston/activity.json` onboarding card is fine — that's written by
  install, not by the agent at runtime).
