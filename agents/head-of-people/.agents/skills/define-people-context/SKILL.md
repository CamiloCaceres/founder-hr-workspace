---
name: define-people-context
description: Use when the user says "draft our people-context doc" / "set up our people context" / "document how we do HR" — drafts or updates the shared `people-context.md` at the agent root, the single source of truth the other three HR agents read.
---

# Define People Context

The Head of People OWNS `people-context.md`. No other agent writes it.
This skill creates or updates it. Its existence is what unblocks the
other three HR agents in the workspace (recruiter, people-ops,
performance-retention).

## When to use

- "draft our people-context doc" / "set up our people context" /
  "document how we do HR" / "let's do people context".
- "update the people-context doc" / "our leveling changed, fix the
  context doc".
- Called implicitly by any other skill that needs the people doc and
  finds it missing — but only after confirming with the user.

## Steps

1. **Read config.** Load `config/company.json`, `config/stage.json`,
   `config/voice.md`. If any is missing, run `onboard-me` first (or
   ask the ONE missing piece just-in-time with the best-modality
   hint: connected app > file > URL > paste).

2. **Read the existing doc if present.** If `people-context.md`
   exists, read it so this run is an update, not a rewrite. Preserve
   anything the founder has already sharpened; change only what's
   stale or new.

3. **Optional import — existing handbook.** Ask once: "Do you have
   an existing handbook / policy doc / comp sheet I should pull from?
   I can read Notion / Google Docs / Google Sheets via Composio if
   you've connected one." If yes, run `composio search docs` or
   `composio search sheets`, fetch, and cite the source in each
   section where content lands.

4. **Push hard on escalation rules — this section cannot be inferred.**
   Before drafting, ask the founder directly: "Who do discrimination
   / harassment / wage-dispute / visa issues route to? A named human
   lawyer, or should we mark TBD?" No defaults. If the founder
   doesn't have a lawyer yet, mark `TBD — needs employment lawyer on
   retainer before first hire` and tell them so explicitly.

5. **Draft the doc (~400-700 words, opinionated, direct).** Structure,
   in this exact order:

   1. **Company values** — 4-6 values with 1-line definitions. Pull
      from the founder's own words; no HR-poster clichés.
   2. **Team shape** — headcount by function, open reqs. Pull from
      connected HRIS if available; otherwise paste.
   3. **Leveling framework** — IC + manager tracks with level names
      and summary expectations. If `leveling-drafts/` has entries,
      cite the latest. Otherwise mark TBD and tell the founder to
      run `draft-leveling-framework` next.
   4. **Comp bands** — range per level, equity stance, location
      multipliers. Accept `TBD` generously — founders at week 0
      don't know their bands yet.
   5. **Review-cycle rhythm** — annual / semi-annual / quarterly,
      next cycle date.
   6. **Policy canon** — leave, benefits, expenses, remote work,
      travel, equipment. Link to source docs where they exist.
      `TBD` where they don't.
   7. **Escalation rules** — agent-answered vs founder-routed vs
      lawyer-routed. Be specific: name the lawyer / firm or write
      `TBD — needs employment lawyer on retainer`. Load-bearing —
      people-ops' `answer-policy-question` classifier reads this
      directly.
   8. **Voice notes** — 4-6 bullets on tone, greeting patterns,
      forbidden phrases, sentence-length preference. Pull from
      `config/voice.md`.
   9. **Hard nos** — what the team will never do (e.g. "we never
      counter-offer on resignations," "we never publish salaries
      publicly," "we always give 30-day notice before equity
      expirations").

6. **Mark gaps honestly.** If a section is thin, write `TBD — {what
   the founder should bring next}` rather than guessing. Never
   invent. Especially never invent comp bands, escalation routing,
   or legal language.

7. **Write atomically.** Write to `people-context.md.tmp`, then
   rename to `people-context.md`. Single file at agent root. NOT
   under a subfolder. NOT under `.agents/`. NOT under
   `.houston/<agent>/`.

8. **Append to `outputs.json`.** Read existing array, append a new
   entry, write atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "people-context",
     "title": "People-context doc updated",
     "summary": "<2-3 sentences — what changed this pass + which sections still TBD>",
     "path": "people-context.md",
     "status": "draft",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

   (The doc itself is a live file, but each substantive edit is
   indexed so the founder sees the update on the dashboard.)

9. **Summarize to user.** One paragraph: what you changed, which
   sections are still `TBD` (especially escalation rules and comp
   bands), and the exact next move (e.g. "Run
   `draft-leveling-framework` next, then paste your current policies
   and I'll fill the canon"). Remind them the other three agents now
   have the context they need.

## Outputs

- `people-context.md` (at the agent root — live document)
- Appends to `outputs.json` with `type: "people-context"`.
