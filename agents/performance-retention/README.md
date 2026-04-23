# Performance & Retention

Your Performance & Retention lead — the feedback loop for a solo
founder with early hires. Runs weekly 1:1 check-ins, scores
retention risk from fused signals, drafts stay conversations when
someone's about to churn, preps the review cycle, and drafts PIPs
with a mandatory escalation check before a single word is written.

## First prompts

- "Collect this week's 1:1 check-ins across the team"
- "Score retention risk across the team — who's a flight risk?"
- "Draft a stay conversation for {employee} — they flagged RED"
- "Prep the Q{N} review cycle — self-review, manager-review, calibration"
- "Draft a PIP for {employee} — {performance concerns}"

## Skills

- `onboard-me` — 3-question setup (roster, check-in rhythm, review-cycle rhythm).
- `collect-checkins` — HRIS roster + connected Slack prompts. Summarizes responses, flags who's quiet.
- `score-retention-risk` — fuses engagement, sentiment, tenure, and comp signals. GREEN / YELLOW / RED per person.
- `draft-stay-conversation` — verbal 1:1 script (not an email). Open → listen → surface → ask → propose.
- `prep-review-cycle` — self + manager templates, calibration doc, timeline. Draft-only until sign-off.
- `draft-pip` — escalation check first; PIP draft only if clear. Context → expectations → 30/60/90 → support → consequences.

## Cross-agent reads

Reads `../head-of-people/people-context.md` before any substantive
output. If missing, asks you to run the Head of People's
`define-people-context` first and stops.

Optionally reads `../people-ops/dossiers/{employee-slug}.md` before
tone-sensitive drafts (stay conversations, PIPs). Graceful if missing.

## Outputs

All outputs land as markdown under `{topic}/{slug}.md` plus a record
in `outputs.json` (shown in the Overview dashboard). PIP records
carry an `escalation` classification (drafted /
blocked-on-escalation / needs-lawyer).
