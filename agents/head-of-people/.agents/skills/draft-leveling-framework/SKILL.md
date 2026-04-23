---
name: draft-leveling-framework
description: Use when the user says "draft our leveling framework" / "what's an L3 vs L4" / "build the leveling ladder" — scaffolds IC + manager tracks with L1-L5, scope, and seniority markers per level, cross-referenced against comp bands in `people-context.md`.
---

# Draft Leveling Framework

Solo founders writing their first leveling framework always need
scaffolding. This skill generates a draft — IC + manager tracks, L1
through L5 by default — that the founder then edits and locks. I
draft, you decide.

## When to use

- "draft our leveling framework" / "build the leveling ladder" /
  "what's an L3 vs L4".
- "scaffold levels for ICs and managers".
- Called implicitly by `define-people-context` when the leveling
  section is empty and the founder confirms.

## Steps

1. **Read people-context doc** (own file): `people-context.md`. If
   missing, run `define-people-context` first (or tell the user to
   start there and stop). The leveling draft cross-references the
   values and comp bands sections.

2. **Read config.** Load `config/stage.json` — at `pre-first-hire`
   the draft is lighter and more scaffolded; at `15+` it's tighter
   and more opinionated.

3. **Ask ONE clarifying question.** "L1-L5 by default — want to add
   higher levels (L6, L7)? And do you want a separate manager track
   or just IC?" Accept the answer or default to IC + manager, L1-L5.

4. **Draft both tracks.** For each track (IC, manager) and each
   level:

   - **Name** — e.g. "Engineer I", "Senior Engineer", "Staff
     Engineer" (IC) or "Engineering Manager", "Senior Engineering
     Manager", "Director of Engineering" (manager). Adapt to the
     founder's function if they named one (design, sales, product).
   - **Summary expectations** — one paragraph on what this level is
     expected to produce.
   - **Scope of impact** — team / function / org / cross-org.
   - **Seniority markers** — rough years-of-experience band,
     decision rights, ambiguity tolerance. No more than 3-4 bullets.
   - **Comp band cross-reference** — if `people-context.md` has a
     comp band for this level, cite it. If not, mark `Comp band:
     TBD — set in people-context.md`.

5. **Mark gaps honestly.** If the founder can't articulate the
   difference between L3 and L4 yet, write `TBD — founder to
   differentiate` rather than inventing. Don't pad with generic HR
   prose.

6. **Cross-reference against values.** For each level, add one line:
   "Embodies {value X, value Y} at this level by…" — ties leveling
   to the values already in `people-context.md`. If values are
   missing, skip this line and flag it.

7. **Structure the artifact (markdown, ~600-1000 words).** File:
   `leveling-drafts/{YYYY-MM-DD}.md` where date is today ISO. Top of
   file: a one-paragraph TL;DR ("5 levels, IC + manager, {any gaps
   flagged}"). Then the IC track (L1 to Lmax), then the manager
   track (L1 to Lmax). End with a short "Next moves" section — what
   the founder should edit, what comp bands to add to
   `people-context.md`.

8. **Write atomically** — `{path}.tmp` then rename.

9. **Append to `outputs.json`.** Read-merge-write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "leveling",
     "title": "Leveling framework draft — <YYYY-MM-DD>",
     "summary": "<2-3 sentences — tracks drafted + level count + what's still TBD>",
     "path": "leveling-drafts/<YYYY-MM-DD>.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

10. **Offer the people-context update.** Ask: "Want me to paste the
    level summaries into the leveling section of
    `people-context.md`?" If yes, run `define-people-context` in
    update mode (only the leveling section).

11. **Summarize to user.** One paragraph: tracks drafted, levels
    drafted, top 3 gaps for the founder to fill, path to the draft.

## Outputs

- `leveling-drafts/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "leveling"`.
- May trigger a `define-people-context` update (user approval
  required).
