# Build Conventions — hr-workspace

Every build subagent reads this before writing files. Reference
implementations:

- `../founder-marketing-workspace/agents/head-of-marketing/` — canonical coordinator shape with shared-doc ownership.
- `../founder-marketing-workspace/agents/seo-content/` — canonical non-coordinator shape that reads the shared doc.
- `../founder-marketing-workspace/scripts/bundle_template.js` + `generate_bundles.py` — dashboard generator pattern.
- `../role-agents-workspace/role-agent-guide.md` — full 696-line contract.
- `../AGENT-DESIGN-PHILOSOPHY.md` — the *why* behind every rule.
- `../BUILDING-A-VERTICAL.md` — the six-phase playbook.
- `TEAM-GUIDE.md` (this workspace) — agent roster, skill lists, source mappings.

## File tree per agent

```
agents/{agent-id}/
├── houston.json            # manifest (required)
├── CLAUDE.md               # 50–100 lines, pointer-style identity + skill index
├── data-schema.md          # documents every file read/written
├── README.md               # who this agent is for + first prompts
├── bundle.js               # read-only dashboard (generated from scripts/bundle_template.js)
├── icon.png                # 256×256 solid-color PNG
├── .gitignore              # *.tmp + config/
└── .agents/skills/
    ├── onboard-me/SKILL.md
    └── {skill}/SKILL.md per skill in TEAM-GUIDE.md
```

## `houston.json` template

Follow the exact shape used by `../founder-marketing-workspace/agents/head-of-marketing/houston.json`. Key fields:

- `id`, `name`, `description`, `icon` (Lucide name), `category: "business"`.
- `author: "Houston Founder HR"`.
- `tags`: include `"hr"`, `"solo-founder"`, role-specific tags.
- `tabs`: five standard tabs — `overview` (custom), `activity` (builtIn: board, badge: activity), `job-description` (builtIn), `files` (builtIn), `integrations` (builtIn). **First tab id MUST be `overview`**, never `dashboard`/`connections`/`settings`.
- `defaultTab: "overview"`.
- `agentSeeds`: include `outputs.json: "[]"` AND `.houston/activity.json` with an onboarding card (one JSON object with id, title, description, status: "needs_you").
- `useCases`: 5–10 per agent with `category`, `title`, `blurb`, `prompt`, `fullPrompt`, `description`, `outcome`, `skill` (+ optional `tool`).

### `useCases` — the four-field prompt model

| Field | Length | Purpose |
|-------|--------|---------|
| `title` | short verb phrase | The CTA on the Overview tile. |
| `blurb` | 6–12 word fragment | Answers "what do I get?" |
| `prompt` | 1–2 lines | Short user-facing prompt with `{placeholders}`. |
| `fullPrompt` | 3–8 lines | Rich clipboard payload. States goal, inputs, deliverable shape, non-obvious constraints. |

Plus `description` (1–2 sentences for Job Description), `outcome` (concrete artifact path), `skill` (SKILL.md slug), `tool` (optional eyebrow label).

**Writing rules (from Philosophy §8):**

1. Concrete, not generic. ❌ "Analyze my people ops." ✅ "Give me the Monday people review — hires, flight risks, open reqs."
2. `title` leads with a verb. ❌ "Offer letter drafting skill." ✅ "Draft the offer letter against our comp bands."
3. `blurb` is a fragment. *"Against our comp band, equity, start date."*
4. `fullPrompt` references skill/tool in plain language. "Use the `draft-offer` skill; pull comp bands from `people-context.md`."
5. `outcome` names the artifact path. *"An offer letter at `offers/{candidate-slug}.md`."*
6. `useCases[0]` is the highest-value first action.
7. No fluff.

## `CLAUDE.md` template (50–100 lines)

Follow `../founder-marketing-workspace/agents/head-of-marketing/CLAUDE.md` (coordinator) or `../founder-marketing-workspace/agents/seo-content/CLAUDE.md` (non-coordinator) exactly. Required sections, in order:

1. `# I'm your {role}` — 2–3 lines: mission + boundary.
2. `## To start` — onboarding card + trigger rule (short/empty first message AND missing `config/profile.json` → run `onboard-me`).
3. `## My skills` — one line per skill: "`skill-name` — use when X".
4. **Coordinator only (Head of People):** `## I own people-context.md` section stating ownership, update rule, non-indexing in outputs.json.
5. **Non-coordinator only (Recruiter · People Ops · Perf&Ret):** `## Cross-agent read (shared people-context doc)` — pointer to `../head-of-people/people-context.md`, rule: "before any substantive output, read it; if missing, stop and ask user to run Head of People first."
6. `## Composio is my only transport` — name the agent's categories (ATS · Slack · Docs · HRIS · Sheets · Glassdoor/review sources · Calendar).
7. `## Data rules` — agent root, never under `.houston/<agent>/`, atomic writes, list key top-level files.
8. `## What I never do` — role-specific hard nos + universals.

## `SKILL.md` template

```markdown
---
name: {skill-id}
description: Use when {observable trigger} — {one-sentence summary}.
---

# {Skill Title}

## When to use

- Explicit trigger phrases the user says.
- Implicit triggers (another skill calls this as a dependency).
- Frequency (if relevant).

## Steps

1. **Read people-context doc** (non-HoP agents only):
   `../head-of-people/people-context.md`. If missing, tell the user to
   run the Head of People's `define-people-context` first and stop.
2. **Read config** needed for this skill. If missing, ask ONE targeted
   question naming best modality (connected app > file/URL > paste).
3. {actual work — concrete, numbered, imperative}
4. **Write** the markdown artifact to `{topic}/{slug}.md` (atomic:
   `*.tmp` → rename).
5. **Append to `outputs.json`** — new entry with the Output schema.
6. **Summarize to user** — one paragraph + path to the artifact.

## Outputs

- `{topic}/{slug}.md`
- Appends to `outputs.json` with `{ id, type, title, summary, path,
  status, createdAt, updatedAt }`.
```

**Rules:**

- Description starts with "Use when…" and names observable trigger.
- One skill = one purpose.
- Every skill drafting messages (offers, PIPs, stay conversations)
  reads `voice.md` AND `people-context.md`'s voice notes section.
- Every non-HoP skill reads `people-context.md` first.
- Every skill writes both a markdown artifact AND an `outputs.json`
  entry.
- No hardcoded tool names — `composio search <category>`.
- Atomic writes.

## `outputs.json` schema

```ts
interface Output {
  id: string;           // uuid v4
  type: string;         // agent-specific
  title: string;
  summary: string;      // 2–3 sentences
  path: string;         // relative to agent root
  status: "draft" | "ready";
  createdAt: string;    // ISO-8601
  updatedAt: string;
}
```

- `draft` while iterating; flip to `ready` on sign-off.
- Update: refresh `updatedAt`, never touch `createdAt`.
- Read-merge-write; never overwrite.

## `bundle.js` — generated, not hand-authored

Every agent's `bundle.js` is generated from `scripts/bundle_template.js` + that agent's `houston.json` by `scripts/generate_bundles.py`. Do NOT hand-author `bundle.js`.

Per-agent inputs the generator needs:

1. Agent display name (from `houston.json`).
2. One-line tagline (in `generate_bundles.py`'s `TAGLINES` dict).
3. `useCases` array (from `houston.json`).

Regenerate after editing `useCases` or the template:

```bash
python3 scripts/generate_bundles.py
```

Hard rules the template enforces:

- `var React = window.Houston.React;` — never `import React`.
- `React.createElement` (aliased as `h`). No JSX.
- Export: `window.__houston_bundle__ = { Dashboard: Dashboard };`.
- Keep `useHoustonEvent("houston-event", ...)` literal in a comment
  (Phase-6 grep check).
- Scoped `<style>` block — no Tailwind accents that aren't already in
  Houston's CSS scan.

## `data-schema.md`

Document every file the agent reads/writes:

1. `config/` files — what learned context, written by which skill.
2. Top-level files at agent root.
3. Subfolders (e.g. `candidates/{slug}.md`).
4. Cross-agent reads (non-HoP: `../head-of-people/people-context.md`).
5. Atomic-write rule + `.houston/` prohibition.

Target 100–180 lines.

## `README.md` per agent (~40 lines)

```markdown
# {Agent Name}

{2-sentence mission.}

## First prompts

- "{use case 1}"
- ...

## Skills

{short bulleted list matching CLAUDE.md}

## Cross-agent reads

Reads `../head-of-people/people-context.md` before any substantive
output. (HoP omits — it owns the doc.)

## Outputs

All outputs land as markdown under `{topic}/{slug}.md` plus a record in
`outputs.json` (shown in the Overview dashboard).
```

## `.gitignore` per agent

```
*.tmp
config/
```

## Hard rules (summary — break these = rebuild)

1. **Never write under `.houston/<agent-path>/`** at runtime. Seeded `.houston/activity.json` at install is fine.
2. **Never use JSX or build tools** — hand-crafted IIFE.
3. **Never hardcode tool names** — Composio only.
4. **Never skip atomic writes** — temp-file + rename.
5. **Never exceed 3 questions in onboard-me.**
6. **Every skill description starts with "Use when…"**
7. **Non-HoP agents read `people-context.md` first** — if missing, stop.
8. **Legal-sensitive topics escalate** — see `people-context.md` escalation rules. Never draft anti-discrimination investigations, severance negotiations, or visa legal opinions; route to a human lawyer.
9. **First tab id is `overview`**, not `dashboard`/`connections`/`settings`.
10. **All records carry `id` (UUID v4), `createdAt`, `updatedAt` (ISO-8601 UTC).**
