# Performance & Retention — Data Schema

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

## Cross-agent reads

**`../head-of-people/people-context.md`** (required, read-only)
— the shared values / leveling / comp stance / review-cycle rhythm /
policy canon / escalation rules / voice notes / hard nos owned by the
Head of People. Before any substantive output, this agent reads it.
If missing or empty, skills tell the user to run the Head of People's
`define-people-context` first and stop.

**`../people-ops/dossiers/{employee-slug}.md`** (optional, read-only,
graceful if missing) — per-employee dossier written by People Ops'
`employee-dossier` skill. Tone-sensitive skills (`draft-pip`,
`draft-stay-conversation`) read it if it exists for additional
context. If missing, skills proceed from check-ins + signals and note
the gap to the user.

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

### `config/roster.json` — written by `onboard-me`

```ts
interface Roster {
  source: "connected-hris" | "paste" | "file";
  hrisCategory?: string;       // e.g. "gusto", "deel", "rippling"
  members?: {                   // when pasted / file fallback
    name: string;
    role: string;
    slackHandle?: string;
    startDate?: string;         // ISO
  }[];
  capturedAt: string;
}
```

### `config/checkin-rhythm.json` — written by `onboard-me`

```ts
interface CheckinRhythm {
  cadence: "weekly" | "biweekly" | "monthly";
  channel: {
    kind: "slack-channel" | "slack-dm" | "email" | "paste";
    ref?: string;               // e.g. "#checkins", "dm-per-person"
  };
  defaultPrompt?: string;       // optional override; else read from people-context.md
  capturedAt: string;
}
```

### `config/review-cycle.json` — written by `onboard-me`

```ts
interface ReviewCycle {
  cadence: "annual" | "semi-annual" | "quarterly";
  nextCycleDate?: string;       // ISO, or "TBD"
  source: "paste" | "people-context" | "file";
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
  type: "checkin" | "retention-score" | "stay-conversation"
      | "review-cycle" | "pip";
  title: string;
  summary: string;     // 2-3 sentences — the conclusion of this artifact
  path: string;        // relative to agent root
  status: "draft" | "ready";
  // PIP-specific: escalation classification
  escalation?: "drafted" | "blocked-on-escalation" | "needs-lawyer";
  createdAt: string;   // ISO-8601
  updatedAt: string;   // ISO-8601
}
```

Rules:
- On update, refresh `updatedAt`, never touch `createdAt`.
- Never overwrite the array — read, merge, write atomically.
- Mark `draft` while iterating; flip to `ready` on founder sign-off.
- PIP records always carry an `escalation` field; the dashboard
  surfaces `needs-lawyer` entries prominently.

---

## Topic subfolders (markdown files)

Each output's full document is a markdown file under a topic
subfolder at the agent root. The subfolder is created on first use.

| Subfolder                | Written by               | Contents                                                                 | `type`              |
| ------------------------ | ------------------------ | ------------------------------------------------------------------------ | ------------------- |
| `checkins/`              | `collect-checkins`       | `{YYYY-MM-DD}.md` — weekly check-in summary (responses, themes, flags). | `checkin`           |
| `retention-scores/`      | `score-retention-risk`   | `{YYYY-MM-DD}.md` — per-person GREEN/YELLOW/RED with signal reasoning.  | `retention-score`   |
| `stay-conversations/`    | `draft-stay-conversation`| `{employee-slug}.md` — verbal 1:1 script (open → listen → surface → ask → propose). | `stay-conversation` |
| `review-cycles/`         | `prep-review-cycle`      | `{cycle-slug}.md` — self + manager templates, calibration doc, timeline. | `review-cycle`      |
| `pips/`                  | `draft-pip`              | `{employee-slug}.md` — PIP draft OR escalation note when check fires.    | `pip`               |

Filenames are kebab-case; dates are ISO (`YYYY-MM-DD`); cycle slugs
are `YYYY-q{N}` or `YYYY-h{N}` or `YYYY`.

---

## Sensitivity rules per subfolder

- `retention-scores/` — founder-eyes-only. Never shared in public
  channels. Dashboard surfaces counts, not individual names, unless
  the founder explicitly drills in.
- `stay-conversations/` — verbal-prompt only. Every summary to the
  user explicitly says "this is a prompt, don't send it."
- `pips/` — draft-only until the founder signs off. Records carry an
  `escalation` classification; `needs-lawyer` entries include a
  one-paragraph note naming the trigger, not a PIP body.
- `checkins/` — individual responses are retained verbatim; theme
  summaries aggregate across the team.
- `review-cycles/` — `status: "draft"` until the founder approves the
  cycle structure; flip to `ready` only after sign-off.

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON
  readable by the dashboard.
- IDs are uuid v4.
- Timestamps are ISO-8601.
- Updates mutate `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in-place — read the existing array, append
  or update in memory, write atomically.
- Never write under `.houston/<agent>/` (the seeded
  `.houston/activity.json` onboarding card is fine — that's written by
  install, not by the agent at runtime).
- HRIS is always read-only — we never write roster, comp, or status
  changes back to the HRIS.
