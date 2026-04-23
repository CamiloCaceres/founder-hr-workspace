# Founder HR Workspace

A Houston workspace of **four AI HR hires for solo founders**. You
chat with them; they produce markdown artifacts (policy answers, offer
letters, onboarding plans, review templates, stay-conversation scripts)
and keep them consistent across your team via one shared people-context
doc.

Built for: the founder at week 0 of formal people ops — 1–5 early hires
(or the first one starts Monday), no HR person, no recruiter on
retainer, offers and contracts in Google Docs, no handbook yet.

---

## The four agents

| Agent | Hired to… | Good first prompt |
|-------|-----------|-------------------|
| **Head of People** | Own the values, leveling, comp stance, and weekly readout | "Set up our people context — values, leveling, comp, policies" |
| **Recruiter** | Source, screen, score, prep interviewers, draft offers, debrief loops | "Score this LinkedIn URL against our rubric for {role}" |
| **People Ops** | Policy Q&A with escalation routing, onboarding, approvals, compliance | "Does {employee} qualify for {PTO / leave / reimbursement}?" |
| **Performance & Retention** | 1:1 rhythm, retention scoring, review cycles, PIP drafting | "Score retention risk across the team — who's a flight risk?" |

---

## Shared state — the people-context doc

The **Head of People** owns a single source-of-truth document:
`agents/head-of-people/people-context.md`.

The other three agents read it (via `../head-of-people/people-context.md`)
before any substantive output. Write it once by chatting with the Head
of People; every other agent stays aligned on values, leveling, comp,
voice, and — critically — **escalation rules** for legal-sensitive
topics.

If the doc is missing, a non-HoP agent will say so and ask you to spend
5 minutes with the Head of People first.

---

## Install

1. Open Houston.
2. Settings → Add workspace from GitHub → paste this repo URL.
3. Houston installs all 4 agents as one workspace.
4. Open the **Head of People**, click the "Onboard me" activity card,
   send a message — 3 questions, ~90 seconds.
5. Ask the Head of People to draft your people-context doc.
6. Now every other agent is aligned. Start chatting with them.

---

## Suggested "first week" of founder HR ops

- **Monday, with Head of People** — people-context doc, leveling draft.
- **Tuesday, with People Ops** — wire up the helpdesk, draft your
  first policy answers, build the compliance calendar.
- **Wednesday, with Recruiter** — set up open reqs, source candidates,
  score your inbound pipeline.
- **Thursday, with Performance & Retention** — set the check-in
  rhythm, run the first retention-risk score.
- **Friday, with Head of People** — the Monday people review across
  all agents.

---

## Conventions

- **Chat-first.** Dashboards are read-only — they show what each agent
  has produced. All actions start with you chatting.
- **Markdown outputs.** Every artifact is a markdown file you can
  open, edit, version, or paste into your tools.
- **Composio is the only transport.** Any connected app (HRIS, ATS,
  Slack, Google Docs, Glassdoor, calendar, etc.) is reached via
  Composio. If a connection is missing, the agent tells you which
  category to link and stops.
- **Standalone-capable.** Each agent would work as a standalone
  install if pulled out — cross-agent reads are limited to the shared
  people-context doc and, for People Ops / Performance & Retention,
  optional reads of each other's dossier / check-in files.
- **Legal-sensitive topics always escalate.** People Ops' policy-Q&A
  classifier and Performance & Retention's PIP-drafter both read the
  escalation rules section of the shared doc and route to a human
  lawyer on trigger categories (discrimination · harassment · wage
  disputes · visa law · protected-class performance actions).

---

## What this workspace will NEVER do

- Process payroll, enroll benefits, or file taxes — that's HRIS /
  finance, out of scope.
- Draft anti-discrimination investigations, severance negotiations, or
  visa legal opinions — those route to a human lawyer.
- Modify HRIS / payroll records — every HRIS tool is read-only from
  these agents.
- Send offers, rejections, PIPs, or policy replies without founder
  sign-off — every outbound is a draft you review.
- Make hire / fire calls alone — the agent recommends, you decide.
- Reveal one employee's confidential data to another.

---

## Attribution & context

The team roster and skill set were derived from a consolidated read
of Gumloop's HR-tagged templates (no dedicated HR category exists —
they're scattered across Operations) plus cross-vertical shape
transfers from the Support, Operations, and Sales workspaces plus
solo-founder coverage gaps. See `TEAM-GUIDE.md` for the design
rationale and `research/` for the source catalog.

---

## License

MIT. See `LICENSE`.
