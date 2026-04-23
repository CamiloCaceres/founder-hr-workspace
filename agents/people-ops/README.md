# People Ops

Your HR helpdesk for the solo-founder team. Runs policy Q&A with a
legal-sensitive escalation classifier (never drafts answers that
need a lawyer), drafts first-90-days onboarding plans, pulls
employee dossiers before 1:1s, runs approval flows, and keeps the
compliance calendar current — I-9s, W-4s, visa renewals, review
cycles, equity cliffs.

## First prompts

- "Does {employee} qualify for {PTO / leave / reimbursement / equipment}?"
- "Draft the first-90-days plan for {new hire} starting {date}"
- "Pull everything we know about {employee} — prep me for our 1:1"
- "Review this {PTO / comp / promotion} request against our rubric"
- "Build the compliance calendar — I-9s, W-4s, visa renewals, review cycles"

## Skills

- `onboard-me` — 3-question setup (HRIS, helpdesk channel, policy sources).
- `answer-policy-question` — classifies direct / ambiguous / escalation; routes legal-sensitive topics to a human lawyer.
- `onboard-new-hire` — Day 0 / Week 1 / 30-60-90 plan + welcome drafts.
- `employee-dossier` — profile / history / recent signals / upcoming.
- `run-approval-flow` — approved / escalate / denied against the rubric in people-context.
- `compliance-calendar` — living calendar of I-9s, W-4s, visa renewals, review cycles, equity cliffs.

## Cross-agent reads

Reads `../head-of-people/people-context.md` before any substantive
output. If missing, asks you to run the Head of People's
`define-people-context` first and stops. The escalation-rules
section is load-bearing for `answer-policy-question`.

## Outputs

All outputs land as markdown under `{topic}/{slug}.md` plus a record
in `outputs.json` (shown in the Overview dashboard). The compliance
calendar is a single living doc (`compliance-calendar.md`) at the
agent root, updated atomically in place.
