# Recruiter — Data Schema

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
`../head-of-people/people-context.md` — the shared values, leveling
framework, comp bands, policy canon, escalation rules, and voice
notes owned by the Head of People. If missing or empty, skills tell
the user to run the Head of People's `define-people-context` first
and stop. The Recruiter never writes to this file.

Load-bearing sections for the Recruiter:

- **Leveling framework** — used by `source-candidates`,
  `screen-resume`, `score-candidate`, `prep-interviewer`,
  `debrief-loop`, `draft-offer`.
- **Comp bands** — used by `draft-offer` (never invent comp; never
  go outside the band without an explicit founder override note).
- **Voice notes** — used by `draft-offer` alongside `config/voice.md`.
- **Escalation rules** — used by every skill to know when to route
  to a human lawyer (e.g. protected-class performance actions,
  visa legal opinions).

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

### `config/ats.json` — written by `onboard-me`

```ts
interface Ats {
  system: "ashby" | "greenhouse" | "lever" | "workable"
        | "notion" | "airtable" | "other" | "none";
  connectedViaComposio: boolean;
  boardUrl?: string;           // Notion / Airtable link if not connected
  notes?: string;
  capturedAt: string;
}
```

### `config/reqs.json` — written by `onboard-me`, appended later

```ts
interface Reqs {
  openReqs: Array<{
    slug: string;              // e.g. "staff-eng-platform"
    title: string;
    level: string;             // referenced into people-context leveling
    openedAt: string;
    status: "open" | "on-hold" | "filled" | "closed";
  }>;
  capturedAt: string;
}
```

### `config/voice.md` — written by `onboard-me`

Markdown notes on hiring-voice tone: how offers / rejections / outreach
sound. Sampled from a connected inbox or pasted past offers. Read by
`draft-offer` alongside the voice-notes section of
`people-context.md`.

---

## Top-level files at agent root

### `outputs.json`

Index of every deliverable this agent has produced. Read by the
dashboard; seeded to `[]` via `agentSeeds`.

```ts
interface Output {
  id: string;          // uuid v4
  type: "sourcing" | "screen" | "score" | "interview-prep"
      | "loop-scheduled" | "debrief" | "offer";
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
- Offers stay `draft` until the founder confirms and sends.

---

## Topic subfolders (markdown files)

Each output's full document is a markdown file under a topic
subfolder at the agent root. The subfolder is created on first use.

| Subfolder              | Written by                                     | Contents                                                                                    | `type`                       |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------- |
| `reqs/`                | captured JIT (usually first run of a skill)    | `{role-slug}.md` — one per open req: criteria rubric, level, comp band (from people-context), must-haves vs nice-to-haves. | n/a (input, not output)      |
| `candidates/`          | `screen-resume`, `score-candidate` (append)    | `{candidate-slug}.md` — per-candidate dossier. Multiple skills append sections (screen notes, LinkedIn score, interview references). | `screen` · `score`           |
| `sourcing-lists/`      | `source-candidates`                            | `{role-slug}-{YYYY-MM-DD}.md` — ranked candidate list for one sourcing pass.                | `sourcing`                   |
| `interview-loops/`     | `prep-interviewer`, `coordinate-interviews`, `debrief-loop` (all append) | `{candidate-slug}.md` — per-candidate loop file: schedule, per-interviewer briefs, feedback, decision memo. | `interview-prep` · `loop-scheduled` · `debrief` |
| `offers/`              | `draft-offer`                                  | `{candidate-slug}.md` — draft offer letter. Status: draft, always.                          | `offer`                      |

Filenames are kebab-case; dates are ISO (`YYYY-MM-DD`). Candidate
slugs are `{first-last}` from the resume / profile.

---

## Append-don't-overwrite files

Two subfolders accumulate sections over time — multiple skills write
to the same file as a candidate progresses:

- `candidates/{slug}.md` — `screen-resume` writes the initial record
  and screen section. `score-candidate` appends a LinkedIn-score
  section (or creates the file if not yet screened). Never overwrite
  existing sections; add a dated section header and keep history.
- `interview-loops/{slug}.md` — `prep-interviewer` seeds the per-
  interviewer brief sections. `coordinate-interviews` appends the
  schedule block + invite drafts. `debrief-loop` appends the decision
  memo. Each section is dated; prior sections are immutable.

---

## Write discipline

- Atomic writes: `{file}.tmp` → rename. Never leave partial JSON
  readable by the dashboard.
- IDs are uuid v4.
- Timestamps are ISO-8601.
- Updates mutate `updatedAt` only; `createdAt` is immutable.
- `outputs.json` is merged in-place — read the existing array, append
  or update in memory, write atomically.
- Append-only files (`candidates/`, `interview-loops/`) are written
  by read → append new dated section → atomic rename. Never truncate.
- Never write under `.houston/<agent>/` (the seeded
  `.houston/activity.json` onboarding card is fine — that's written by
  install, not by the agent at runtime).
