---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (company, stage, voice) AND the best way to share each, then run a tight 90-second 3-question interview and write results to `config/`.
---

# Onboard Me

## When to use

First-run setup. Triggered by:

- "onboard me" / "set me up" / "let's get started".
- The user opens the pre-seeded "Onboard me" activity card and sends
  any short message (including "go", "ok", "start", "yes", or an
  empty-seeming prompt) — when `config/profile.json` is missing,
  treat any short opener as a signal to run me.
- About-to-do-real-work and `config/profile.json` is missing.

Only run ONCE unless the user explicitly re-invokes.

## Principles

- **Lead with a scope + modality preamble.** Name the three topics AND
  the easiest way to share each BEFORE the first question.
- **3 questions is the ceiling, not the target.** If you can do 2, do 2.
- **One question at a time after the preamble.** The preamble did the
  heavy lifting.
- **Rank modalities:** connected app via Composio > file/URL > paste.
- **Anything skipped** → note "TBD" and ask again just-in-time later.

## Steps

0. **Scope + modality preamble — the FIRST message, then roll into Q1:**

   > "Let's get you set up — 3 quick questions, about 90 seconds.
   > Here's what I need and the easiest way to share each:
   >
   > 1. **Your company** — name + a 1-line pitch + current team size.
   >    *Best: connect your HRIS (Gusto / Deel / Rippling / Justworks)
   >    via Composio and I'll pull headcount + titles. Otherwise paste
   >    a line or two.*
   > 2. **Your stage of people ops** — pre-first-hire / 1-5 hires /
   >    5-15 hires / 15+. Tells me how aggressive to be with framework
   >    drafting. *Paste a line.*
   > 3. **Your HR voice** — how you write for the team. *Best: connect
   >    an inbox via Composio and I'll sample past offers/rejections/
   >    announcements. Otherwise paste 2-3 past team messages.*
   >
   > For any of these you can also drop files or share public URLs.
   > Let's start with #1 — what's your company + 1-line pitch?"

1. **Capture topic 1 (company).** Based on modality chosen: parse
   paste, fetch URL via `composio search web-scrape` (execute by
   slug), or — if user picks the connected-HRIS route — run
   `composio search hris` to discover the connected HRIS tool slug
   and pull headcount + titles. Extract name, one-line pitch, team
   size. Write `config/company.json` with `{ name, oneLine, url?,
   teamSize, source, capturedAt }`. Acknowledge and roll into Q2:
   "Got it — what stage of people ops are you at?"

2. **Capture topic 2 (stage).** Accept the paste. Normalize to one
   of: `pre-first-hire`, `1-5`, `5-15`, `15+`. Write
   `config/stage.json` with `{ stage, notes?, capturedAt }`. Roll
   into Q3: "Last one — how do you write for the team? Connected
   inbox, or paste samples?"

3. **Capture topic 3 (voice).** If user took the connected-inbox
   route: run `composio search inbox` to discover their connected
   provider's list-sent-messages tool; fetch 10-20 of their most
   recent HR-ish outbound messages (offers, rejections, team
   announcements); extract tone cues (greeting, closing, sentence
   length, formality, quirks); write 3-5 verbatim excerpts plus a
   tone summary to `config/voice.md`. If they pasted samples, write
   those samples verbatim plus a short tone summary.

4. **Write `config/profile.json`** with `{ userName, company, role?,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.

5. **Atomic writes.** Every file written as `{path}.tmp` then
   renamed to the target. Never partial JSON.

6. **Hand off:** "Ready. Try: `Draft our people-context doc`."

## Outputs

- `config/profile.json`
- `config/company.json`
- `config/stage.json`
- `config/voice.md`

(No entry appended to `outputs.json` — onboarding is setup, not a
deliverable.)
