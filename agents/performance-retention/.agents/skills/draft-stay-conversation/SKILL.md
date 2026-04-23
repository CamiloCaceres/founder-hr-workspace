---
name: draft-stay-conversation
description: Use when the user says "draft a stay conversation for {employee}" / "{employee} might be leaving" / "someone flagged RED — what do I say" — drafts a verbal 1:1 SCRIPT (not an email) for the founder to use in person or on a call. Reads voice and hard-no constraints from `people-context.md`. Writes to `stay-conversations/{employee-slug}.md` and reminds the user: this is a prompt, not something to send.
---

# Draft Stay Conversation

## When to use

- Explicit: "draft a stay conversation for {employee}", "{employee}
  might be leaving", "someone flagged RED — what do I say",
  "retention conversation prep".
- Implicit: recommended by `score-retention-risk` for every RED flag.
- Frequency: one per at-risk employee, re-run if signals change.

## This is NOT an email

A stay conversation is a verbal 1:1 between the founder and the
employee. The output is a SCRIPT the founder reads before the
meeting, not a message to send. Every summary the skill returns must
remind the user: *"This is a prompt for a verbal 1:1 — don't send
it."*

## Steps

1. **Read people-context doc:**
   `../head-of-people/people-context.md`. If missing or empty, tell
   the user to run `define-people-context` first and stop. Read
   **voice notes**, **hard nos** (especially counter-offer policy),
   and **comp stance**.
2. **Read config:** `config/roster.json` to resolve the employee
   slug. If the employee isn't on the roster, ask the user to
   confirm the name + role.
3. **Read the dossier (optional, graceful):**
   `../people-ops/dossiers/{employee-slug}.md`. If it exists, pull
   tenure, role history, recent 1:1 notes, and any prior concerns.
   If missing, note the gap to the user and continue from check-in
   history alone.
4. **Read recent check-ins.** Read the last 3-5 `checkins/` files at
   my root and extract every response from this employee — especially
   any blockers or concerns they've surfaced.
5. **Read the retention-score reasoning.** If a recent
   `retention-scores/` file flagged this employee RED, read the
   reasoning block. The stay conversation should surface the themes
   the signals revealed, not the signals themselves (the employee
   doesn't need to hear "your commit cadence dropped" — they need to
   hear "I've sensed something is off").
6. **Draft the script** in five sections:

   - **Open** — warm, specific, the founder's own voice (pulled from
     `people-context.md` voice notes). One or two sentences that land
     the purpose without ambushing them.
   - **Listen** — 3-4 open-ended questions designed to get the
     employee talking before the founder does. What's going well.
     What's frustrating. What they'd change if they could.
   - **Surface** — what the founder has noticed, framed as
     observation not accusation. Draw from check-in themes and
     dossier history. Never cite engagement signals literally.
   - **Ask** — the direct question: "What would make you want to stay
     here for another year?" Or the equivalent in the founder's
     voice. One clear ask.
   - **Propose** — concrete levers the founder can pull: scope
     change, title change, project move, manager change, comp review.
     Filter every lever against `people-context.md` hard nos — e.g.
     if "we never counter-offer on resignations" is written, comp is
     off the table; redirect to scope / title / project.

7. **Write** to `stay-conversations/{employee-slug}.md` atomically
   (`*.tmp` → rename). Include at the top: "**This is a script for a
   verbal 1:1, not an email. Do not send.**"

8. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "stay-conversation", title, summary, path, status: "draft",
   createdAt, updatedAt }`, write atomically.

9. **Summarize to user** — one paragraph covering the key asks and
   proposed levers, plus the path to the full script. Close with:
   *"This is a prompt for a verbal 1:1 — don't send it. Read it
   before your next 1:1 and adapt in the moment."*

## Never invent

Never fabricate a quote from the employee or a signal the score
didn't surface. If the dossier is missing and check-ins are thin,
the script stays shorter and more open-ended — don't fill gaps with
assumptions.

## Hard rules

- Never recommend a counter-offer unless `people-context.md`
  explicitly allows it.
- Never write this as an email. If the user asks for an email
  version, decline and explain why: a stay conversation is verbal by
  design.
- Never share the script outside founder → employee's manager chain.

## Outputs

- `stay-conversations/{employee-slug}.md`
- Appends to `outputs.json` with type `stay-conversation`.
