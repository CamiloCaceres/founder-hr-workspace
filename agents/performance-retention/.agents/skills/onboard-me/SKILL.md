---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (team roster, check-in rhythm, review-cycle rhythm) AND the best way to share each, then run a tight 90-second 3-question interview and write results to `config/`.
---

# Onboard Me

## When to use

First-run setup. Triggered by:
- "onboard me" / "set me up" / "let's get started"
- The user opens the pre-seeded "Onboard me" activity card (from the
  Needs-you column) and sends any short message to kick it off
  (including "go", "ok", "start", "yes", or even an empty-seeming
  prompt) — when `config/profile.json` is missing, treat any such
  short opener as a signal to run me.
- About-to-do-real-work and `config/profile.json` is missing.

Only run ONCE unless the user explicitly re-invokes.

## Principles

- **Lead with a scope + modality preamble.** Name the three topics AND
  the easiest way to share each BEFORE the first question.
- **3 questions is the ceiling, not the target.**
- **One question at a time after the preamble.**
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note "TBD" and ask again just-in-time later.

## Steps

0. **Scope + modality preamble — the FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your team roster** — who do we run check-ins for?
   >    *Best: connect your HRIS (Gusto / Deel / Rippling / Justworks)
   >    via Composio from the Integrations tab so I can pull the
   >    roster directly. Otherwise paste a list of names + roles.*
   > 2. **Your check-in rhythm** — weekly / biweekly / monthly, and
   >    where responses are collected.
   >    *Best: connect Slack via Composio and tell me the channel.
   >    Otherwise we'll fall back to email or paste.*
   > 3. **Your review-cycle rhythm** — annual / semi-annual /
   >    quarterly, next cycle date if you know it.
   >    *Best: paste a line. Or I'll read the review-cycle section
   >    of people-context.md if it's already filled in.*
   >
   > Let's start with #1 — who's on the team, and is your HRIS
   > connected?"

1. **Capture topic 1 (roster).** If an HRIS is connected: run
   `composio search hris` to discover the tool slug, record it as
   `hrisCategory`, and set `source: "connected-hris"`. If pasted:
   parse names + roles (and Slack handle / start date if provided)
   into `members[]`. Write initial stub to `config/roster.json` with
   `{ source, hrisCategory?, members?, capturedAt }`. Roll into Q2:
   "Got it — now your check-in rhythm. Weekly, biweekly, or monthly?
   And is Slack connected for responses?"
2. **Capture topic 2 (check-in rhythm).** Record cadence + channel.
   If Slack is connected: run `composio search chat` to confirm the
   slug and ask for the channel ref (e.g. `#checkins` or DM-per-person).
   If not connected, fall back to email or paste. If the user has a
   preferred default prompt, record it as `defaultPrompt`; otherwise
   leave unset and the skill reads from `people-context.md`. Write
   `config/checkin-rhythm.json`. Roll into Q3: "Last one — what's
   your review-cycle rhythm (annual / semi-annual / quarterly) and
   do you have a next cycle date?"
3. **Capture topic 3 (review-cycle rhythm).** Record cadence +
   optional next-cycle date. If the user says "read it from the
   people-context doc", set `source: "people-context"` and leave
   `nextCycleDate` unset — the `prep-review-cycle` skill resolves it
   at runtime. Write `config/review-cycle.json`.
4. **Write `config/profile.json`** with `{ userName, company,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.
5. **Hand-off:** "Ready. Try: `Collect this week's check-ins across
   the team`."

## Outputs

- `config/profile.json`
- `config/roster.json`
- `config/checkin-rhythm.json`
- `config/review-cycle.json`
