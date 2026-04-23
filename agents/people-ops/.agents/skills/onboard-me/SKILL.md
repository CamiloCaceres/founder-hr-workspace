---
name: onboard-me
description: Use when the user explicitly says "onboard me" / "set me up" / "let's get started", or on the first real task when no `config/profile.json` exists — open with a scope + modality preamble naming the three topics (HRIS, helpdesk channel, policy sources) AND the best way to share each, then run a tight 90-second 3-question interview and write results to `config/`.
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
   > 1. **Your HRIS** — where employee records live. *Best: connect
   >    your HRIS via Composio (Gusto / Deel / Rippling / Justworks)
   >    from the Integrations tab. Otherwise paste a link to your
   >    Notion / Airtable roster.*
   > 2. **Your helpdesk channel** — where team members ask HR
   >    questions. *Best: connect your Slack (or Discord) and tell me
   >    the channel (e.g. `#ask-hr`). Otherwise tell me where to watch
   >    (Gmail filter, forum, DM).*
   > 3. **Your policy sources** — where policies currently live.
   >    *Best: connect your Notion / Google Docs workspace via
   >    Composio. Otherwise paste the 3 most-referenced policy doc
   >    URLs.*
   >
   > Let's start with #1 — where do your employee records live?"

1. **Capture topic 1 (HRIS).** If the user says an HRIS is
   connected: run `composio search hris` to discover the provider
   slug; record `provider` and set `connectedViaComposio: true`. If
   they paste a roster link instead: store it as `rosterLink` with
   `source: "url"`. Write initial stub to `config/hris.json` with
   `{ provider?, connectedViaComposio, rosterLink?, source,
   capturedAt }`. Acknowledge and roll into Q2: "Got it — now your
   helpdesk channel. Slack connected, or should I watch somewhere
   else?"
2. **Capture topic 2 (helpdesk channel).** If Slack/Discord
   connected: run `composio search chat` to discover the tool slug;
   record `channelKind` and `channelRef`. Otherwise capture the
   fallback spec. Write `config/helpdesk.json` with
   `{ channelKind?, connectedViaComposio, channelRef?, notes?,
   capturedAt }`. Roll into Q3: "Last one — where do your policy
   docs live? Notion or Google Docs connected, or want to paste the
   3 most-referenced doc URLs?"
3. **Capture topic 3 (policy sources).** If connected docs workspace:
   run `composio search docs` to discover the tool slug; record
   `docsCategory` and set `connectedViaComposio: true`. If pasted
   URLs: store up to 3 in `keyDocs` with `source: "url"`. Write
   `config/policy-sources.json` with `{ docsCategory?,
   connectedViaComposio, keyDocs?, source, capturedAt }`.
4. **Write `config/profile.json`** with `{ userName, company,
   onboardedAt, status: "onboarded" | "partial" }`. Use `"partial"`
   if any topic was skipped.
5. **Hand-off:** "Ready. Try: `Does {employee} qualify for {PTO /
   leave / policy}?`"

## Outputs

- `config/profile.json`
- `config/hris.json`
- `config/helpdesk.json`
- `config/policy-sources.json`
