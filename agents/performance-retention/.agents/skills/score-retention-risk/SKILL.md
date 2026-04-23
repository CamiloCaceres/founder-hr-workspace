---
name: score-retention-risk
description: Use when the user says "score retention risk" / "who's a flight risk" / "check team health" — fuses engagement, sentiment, tenure-milestone, and comp-exposure signals per team member, classifies GREEN / YELLOW / RED, and surfaces the specific signal combination on every RED. Writes a dated markdown report under `retention-scores/` and appends to `outputs.json`. Founder-eyes-only — never shared publicly.
---

# Score Retention Risk

## When to use

- Explicit: "score retention risk", "who's a flight risk",
  "check team health", "retention readout".
- Implicit: called before a review cycle, after a manager change, or
  when the founder senses something is off.
- Frequency: safe to run monthly. Running more often produces noise.

## Steps

1. **Read people-context doc:**
   `../head-of-people/people-context.md`. If missing or empty, tell
   the user to run `define-people-context` first and stop. Read the
   leveling framework, comp bands (if present), and escalation rules.
2. **Read config:** `config/roster.json`. If missing, ask ONE
   targeted question naming the best modality ("Is your HRIS
   connected so I can pull the roster directly?"). Write and continue.
3. **Resolve the roster.** Pull current team via
   `composio search hris` if connected, or use `members[]` from
   `config/roster.json`.
4. **Gather signals per person** — fuse four families. For each,
   prefer connected sources; mark UNKNOWN if unavailable.

   - **Engagement:**
     - 1:1 check-in responsiveness trend — read the last 4
       `checkins/{YYYY-MM-DD}.md` files at my root and count response
       rate per person.
     - Slack activity trend — `composio search chat` to pull recent
       activity delta vs 30-day baseline.
     - PR / commit / ticket cadence — `composio search engineering`
       (GitHub / Linear / Jira) for ICs on engineering tracks.

   - **Sentiment:**
     - Check-in response tone — read recent check-in bodies for
       sentiment shift.
     - Cross-team mentions — frequency in other people's check-ins
       and in connected chat channels.
     - Anonymous-feedback mentions — if a review / survey source is
       connected, pull mentions.

   - **Tenure milestones:**
     - Approaching cliff vesting (typically month 12 for a 4-year
       vest with 1-year cliff — confirm from `people-context.md`).
     - Post-promotion honeymoon (90 days after a promotion or level
       change — elevated risk if signals also dip).
     - Recent manager change (last 60 days).

   - **Comp exposure:**
     - Time since last comp review — flag if > cycle cadence defined
       in `people-context.md`.
     - Gap vs market — if `people-context.md` has comp bands, compare
       current comp to band midpoint; flag if > 15% below.

5. **Classify** per person using signal fusion (do NOT publish a
   formula the team could game):
   - **RED** — 2+ signal families showing negative delta AND at least
     one tenure-milestone or comp-exposure trigger.
   - **YELLOW** — 1 signal family showing negative delta, or a
     standalone tenure / comp trigger without engagement confirmation.
   - **GREEN** — no triggering signals.

6. **For every RED**, write a short reasoning block naming the
   specific signal combination (e.g. "check-in response rate dropped
   from 4/4 to 1/4 over the last month + approaching 12-month cliff
   + last comp review 14 months ago"). Recommend
   `draft-stay-conversation` as the next move. Do NOT recommend a
   counter-offer unless `people-context.md` explicitly allows it.

7. **Write** to `retention-scores/{YYYY-MM-DD}.md` atomically
   (`*.tmp` → rename). Structure: Summary counts (green / yellow /
   red) → Per-person scores (alphabetical by first name) → RED
   reasoning block → Recommended next actions.

8. **Append to `outputs.json`** — read existing array, add
   `{ id, type: "retention-score", title, summary, path, status: "ready",
   createdAt, updatedAt }`, write atomically.

9. **Summarize to user** — one paragraph with counts and the path to
   the full report. Remind the user explicitly: this is founder-eyes
   -only, never post in a public channel. For REDs, recommend running
   `draft-stay-conversation` per person.

## Never invent

Every signal has a source. If engineering tools aren't connected,
mark that family UNKNOWN for engineering ICs — do not guess a commit
trend. If comp bands aren't in `people-context.md`, skip the gap-vs-
market check rather than inventing a market number.

## Outputs

- `retention-scores/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with type `retention-score`.
