---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (ATS / hiring pipeline, open reqs, hiring voice) AND the best way to share each, then run a tight 90-second 3-question interview and write results to `config/`.
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
   > I also read the shared `people-context.md` owned by the Head of
   > People for leveling, comp bands, and voice — run that agent
   > first if you haven't. Here's what I need from you now and the
   > easiest way to share each:
   >
   > 1. **Your ATS / hiring pipeline** — where candidate records live
   >    today. *Best: connect your ATS via Composio (Ashby /
   >    Greenhouse / Lever / Workable) from the Integrations tab. Or
   >    paste a link to your Notion / Airtable board.*
   > 2. **Your open reqs** — roles you're hiring for right now.
   >    *Paste a short list, or I'll read the team-shape section of
   >    `people-context.md` if it exists.*
   > 3. **Your hiring voice** — how you write offers and rejections.
   >    *Best: connect your inbox via Composio (Gmail / Outlook) so I
   >    can sample past offers. Otherwise paste 2 past offer letters.*
   >
   > Let's start with #1 — what's your ATS, or is everything still in
   > Notion / Airtable / a Google sheet?"

1. **Capture topic 1 (ATS / pipeline).** If user says they've
   connected an ATS: run `composio search ats` to discover the tool
   slug; record `system` and set `connectedViaComposio: true`. If
   they paste a Notion / Airtable / sheet link: store `system` as
   `"notion"` / `"airtable"` / `"other"` and `boardUrl`. Write
   `config/ats.json` with `{ system, connectedViaComposio, boardUrl?,
   notes?, capturedAt }`. Acknowledge and roll into Q2: "Got it —
   what roles are you hiring for right now?"
2. **Capture topic 2 (open reqs).** Parse the list the user pastes.
   For each, extract `{ slug, title, level }` — level may be left
   blank and resolved against `people-context.md` the first time a
   skill needs it. Write `config/reqs.json` with
   `{ openReqs: [...], capturedAt }`. Roll into Q3: "Last one — can
   I sample past offers for your voice? I can connect to your inbox,
   or you can paste 2 past offer letters."
3. **Capture topic 3 (hiring voice).** If user says they've connected
   their inbox: run `composio search inbox` to discover the tool slug,
   sample recent sent messages where the subject / body reads like an
   offer or hiring outbound. If they paste 1-2 past offers: use those.
   Either way, distill a short voice note (tone, sentence length,
   greeting / sign-off patterns) and write `config/voice.md`. If
   nothing is shared, note "TBD — will ask JIT on first offer draft"
   and continue.
4. **Write `config/profile.json`** with `{ userName, company,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.
5. **Hand-off:** "Ready. Try: `Score this LinkedIn URL against our
   {role} rubric`."

## Outputs

- `config/profile.json`
- `config/ats.json`
- `config/reqs.json`
- `config/voice.md`
