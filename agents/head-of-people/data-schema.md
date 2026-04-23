# Head of People — Data Schema

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
reactivity breaks. Exception: the seeded `.houston/activity.json`
onboarding card at install time is fine; the agent never writes there
at runtime.

---

## Config — what the agent learns about the user

Nothing in `config/` is shipped in the repo. Every file appears at
runtime, written by `onboard-me` or by progressive capture.

### `config/profile.json` — written by `onboard-me`

```ts
interface Profile {
  userName: string;
  company: string;
  role?: string;
  onboardedAt: string;        // ISO-8601
  status: "onboarded" | "partial";
}
```

### `config/company.json` — written by `onboard-me`

```ts
interface Company {
  name: string;
  oneLine: string;            // one-line pitch
  url?: string;
  teamSize: number;
  source: "paste" | "url" | "file" | "connected-hris";
  capturedAt: string;
}
```

### `config/stage.json` — written by `onboard-me`

```ts
interface Stage {
  stage: "pre-first-hire" | "1-5" | "5-15" | "15+";
  notes?: string;             // free-text qualifier
  capturedAt: string;
}
```

Used to tune how aggressive framework drafting is — pre-first-hire
gets scaffolding with lots of TBDs; 15+ gets tighter, more
opinionated drafts.

### `config/voice.md` — written by `onboard-me` and refreshed by `voice-calibration`

Markdown. 3-5 verbatim samples of the user's HR writing plus a short
"tone notes" block (greeting habits, sentence length, formality,
quirks). Refreshable.

---

## The shared people-context doc

### `people-context.md` — written by `define-people-context` and `voice-calibration`

**Special file.** Lives at the agent root (NOT in a subfolder, NOT
under `.agents/`). This is the single source of truth for values,
leveling, comp, policy canon, escalation rules, and HR voice across
the whole workspace.

- The Head of People is the ONLY agent that writes it.
- `define-people-context` creates / updates every section.
- `voice-calibration` appends to the voice-notes section only.
- Every non-HoP agent reads it via
  `../head-of-people/people-context.md` before any substantive
  output. If missing, they stop and tell the user to run the Head of
  People first.
- It is a live document, NOT a deliverable file — it is **not**
  recorded in `outputs.json` as a file. But each substantive edit IS
  appended to `outputs.json` as an entry of type `"people-context"`
  so the founder sees the update trail on the dashboard.

Structure (markdown, ~400-700 words), in this order:

1. Company values — 4-6 values with 1-line definitions.
2. Team shape — headcount by function, open reqs.
3. Leveling framework — IC + manager tracks with level names and
   summary expectations.
4. Comp bands — range per level, equity stance, location multipliers.
5. Review-cycle rhythm — annual / semi-annual / quarterly, next cycle
   date.
6. Policy canon — leave, benefits, expenses, remote work, travel,
   equipment. Links to source docs; `TBD` where they don't exist yet.
7. Escalation rules — agent-answered vs founder-routed vs
   lawyer-routed (discrimination · harassment · wage disputes · visa
   law · protected-class performance actions).
8. Voice notes — tone fingerprint for HR comms (4-6 bullets).
9. Hard nos — what the team will never do.

---

## Domain data — what the agent produces

### `outputs.json` — dashboard index

Single array at the agent root. Every substantive artifact appends an
entry. Read-merge-write atomically — never overwrite the whole array.

```ts
interface Output extends BaseRecord {
  type: "people-context"        // define-people-context (per substantive edit of the live doc)
       | "leveling"             // draft-leveling-framework
       | "voice-calibration"    // voice-calibration (summary of what changed)
       | "employer-brand"       // synthesize-employer-brand
       | "review";              // weekly-people-review
  title: string;
  summary: string;              // 2-3 sentences — what this artifact concludes
  path: string;                 // relative to agent root
  status: "draft" | "ready";
}
```

- Mark `draft` while iterating with the founder. Flip to `ready` on
  sign-off. Weekly reviews ship as `ready` (factual rollups).
- On update: refresh `updatedAt`, never touch `createdAt`.

### Topic subfolders

All markdown artifacts. One file per deliverable.

| Subfolder | Written by | Filename pattern | Content |
|-----------|------------|------------------|---------|
| `leveling-drafts/` | `draft-leveling-framework` | `{YYYY-MM-DD}.md` | IC + manager tracks, L1-L5, scope + markers per level |
| `employer-brand-briefs/` | `synthesize-employer-brand` | `{YYYY-MM-DD}.md` | Leadership readout — top strengths, top concerns, patterns, recommended responses |
| `reviews/` | `weekly-people-review` | `{YYYY-MM-DD}.md` | Weekly cross-agent rollup + gaps + next moves |

---

## Cross-agent reads

The Head of People reads (never writes) these files to produce the
Monday review:

- `../recruiter/outputs.json`
- `../people-ops/outputs.json`
- `../performance-retention/outputs.json`

Each read handles missing gracefully — if an agent isn't installed or
has no outputs yet, note it as "no activity" and continue.

Note the direction: the Head of People is the only agent that reads
peer outputs indexes. The other three HR agents read only
`../head-of-people/people-context.md` — read-only, the shared doc.
They do NOT read each other's outputs.

---

## Write discipline

- **Atomic writes.** Always write to `{file}.tmp` first, then rename.
  Partial JSON crashes the dashboard.
- **IDs** are UUID v4.
- **Timestamps** are ISO-8601 UTC.
- **Never write under `.houston/<agent>/` at runtime.** The watcher
  skips that path. The seeded install-time `.houston/activity.json`
  card is fine — that's written once at install, not by the agent.
- **`people-context.md` is live.** The file itself is not recorded as
  an entry in `outputs.json`. But every substantive edit appends a
  `"people-context"` entry so the dashboard shows the update.
