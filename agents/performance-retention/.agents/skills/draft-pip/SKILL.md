---
name: draft-pip
description: Use when the user says "draft a PIP for {employee}" / "performance improvement plan for {employee}" / "{manager} flagged {employee} for performance concerns" — runs a MANDATORY escalation check against `people-context.md`'s escalation rules BEFORE drafting. If a protected-class + pretextual-timing trigger fires, stops and drafts an escalation note routing to a human lawyer. If clear, drafts the PIP (Context → Expectations → 30/60/90 Milestones → Support → Consequences). Writes to `pips/{employee-slug}.md` with escalation classification; never delivered without founder sign-off.
---

# Draft PIP

## When to use

- Explicit: "draft a PIP for {employee}", "performance improvement
  plan for {employee}", "{manager} flagged {employee} for performance
  concerns".
- Never implicit. PIPs are intentional — always triggered by the
  founder, never auto-suggested by another skill.
- Most tone-sensitive document this agent produces. Reads voice notes
  carefully and runs the escalation check first, always.

## The escalation check comes first — no exceptions

PIPs are the single highest-risk HR artifact for a solo founder
without a lawyer on retainer. A PIP drafted in a protected-class
retaliation pattern is a wrongful-termination suit waiting to happen,
even if the performance concerns are real. This skill does NOT draft
a PIP until the escalation check clears.

## Steps

1. **Read people-context doc:**
   `../head-of-people/people-context.md`. If missing or empty, tell
   the user to run `define-people-context` first and stop. PIPs are
   never drafted without the people-context doc.

2. **Read the escalation-rules section** of `people-context.md`
   specifically. Note every trigger listed. The canonical set
   includes (but the doc is authoritative):
   - Protected class (race, gender, age 40+, pregnancy, disability,
     religion, national origin, sexual orientation, veteran status —
     confirm the user's jurisdiction's list).
   - Protected activity within the trigger window: medical leave
     request, pregnancy disclosure, disability accommodation request,
     whistleblower / good-faith complaint, union activity, workers'
     comp claim.
   - Timing trigger: concerns arising or escalating within 30-90 days
     (depending on `people-context.md`) of any protected activity.

3. **Assess this case.** Ask the user — or read the dossier at
   `../people-ops/dossiers/{employee-slug}.md` if it exists — for
   the employee's:
   - Protected-class status (do NOT guess; if unknown, ask directly
     and explain why: "I need this to run the escalation check —
     nothing is drafted until we clear it").
   - Recent protected activity (leave / disclosure / complaint /
     claim).
   - Timeline of when performance concerns were first documented vs
     when protected activity occurred.

4. **Run the trigger logic.** If ANY trigger matches:
   - STOP. Do NOT draft the PIP.
   - Write to `pips/{employee-slug}.md` an **escalation note** (not
     a PIP), structured as: "This case needs a human lawyer before
     any PIP is written because: {specific trigger}. The match:
     {employee's protected class/activity} + {timing of performance
     concerns}." Add a short paragraph on why this routes to a
     lawyer: retaliation claims hinge on pretextual timing, and a
     PIP drafted in this window — even a fair one — creates legal
     risk the founder should not absorb without counsel.
   - Append to `outputs.json` with `type: "pip"`,
     `status: "draft"`, and
     `escalation: "needs-lawyer"`.
   - Summarize to user: "Escalation triggered — I've stopped and
     written an escalation note at `pips/{employee-slug}.md`. Do
     not draft or deliver a PIP until a lawyer has reviewed this
     case. Specific trigger: {trigger}."
   - Do NOT continue to the PIP draft steps.

5. **If the escalation check is clear**, continue.

6. **Read the dossier (optional, graceful):**
   `../people-ops/dossiers/{employee-slug}.md`. If it exists, pull
   tenure, role history, recent performance notes, prior manager
   feedback, and any prior concerns. If missing, note the gap and
   work from recent check-ins + the user's stated concerns.

7. **Read recent check-ins.** Read the last 4-6 `checkins/` files and
   extract responses from this employee — especially blockers,
   frustrations, or themes that tie to the performance concerns.

8. **Read leveling + voice notes** from `people-context.md`. The
   "Expectations" section MUST tie to the leveling framework (what
   "meeting the bar" looks like at this employee's level). The PIP's
   tone MUST match the voice notes — PIPs land harder or softer than
   intended if the voice is off.

9. **Draft the PIP** with this structure:

   - **Context** — what is specifically underperforming, with
     concrete examples dated and sourced. Evidence-first. No vibes,
     no generalizations. If an example can't be sourced, leave it
     out — do not invent.
   - **Expectations** — what "meeting the bar" looks like at this
     level, pulled from the leveling framework. Each expectation is
     observable and measurable.
   - **Milestones** — 30-day, 60-day, 90-day checkpoints. Each
     checkpoint names the measurable criteria the employee must
     demonstrate by that date. Criteria tied to the expectations,
     not vibes.
   - **Support** — what the founder and their manager will provide:
     weekly 1:1s, explicit feedback cadence, training budget, pairing
     with a senior teammate, clearer project scope. Be concrete; a
     PIP without real support is paper.
   - **Consequences** — what happens if milestones aren't met at 30 /
     60 / 90. State this plainly in the founder's voice — neither
     softened nor threatening.

10. **Write** to `pips/{employee-slug}.md` atomically
    (`*.tmp` → rename). Include at the top: "**Draft PIP — not to be
    delivered without founder sign-off.**"

11. **Append to `outputs.json`** — read existing array, add
    `{ id, type: "pip", title, summary, path, status: "draft",
    escalation: "drafted", createdAt, updatedAt }`, write atomically.

12. **Summarize to user** — one paragraph with the Context summary,
    the 30/60/90 milestones at a glance, the path to the full draft,
    and the escalation classification (`drafted`). Close with:
    *"This is a draft. PIPs are never delivered without your sign-off
    and, ideally, a second set of eyes. Read the draft, tell me what
    to change, and flip status to `ready` when you've signed off."*

## Escalation classifications

Every PIP output record carries one of:

- `"drafted"` — escalation check cleared, PIP drafted.
- `"blocked-on-escalation"` — mid-draft pause, waiting on founder
  clarification of a protected-class / protected-activity fact.
- `"needs-lawyer"` — escalation check fired. No PIP drafted; file
  contains the escalation note only.

## Never invent

Never fabricate examples, dates, or quotes for the Context section.
If the manager has flagged concerns verbally without written
evidence, tell the user: "I need the specific examples in writing
before I draft the Context section — invented examples destroy a
PIP's legal and human legitimacy."

## Hard rules

- Escalation check runs BEFORE every draft, no exceptions.
- PIPs are `status: "draft"` until founder sign-off — never auto-ready.
- Never deliver a PIP via any channel. Output is a file at the agent
  root — the founder chooses if and when to deliver.
- Never include retention-score reasoning in a PIP. Performance
  evidence and engagement signals are different documents.

## Outputs

- `pips/{employee-slug}.md`
- Appends to `outputs.json` with type `pip` and one of the three
  escalation classifications.
