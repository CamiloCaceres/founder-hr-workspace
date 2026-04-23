---
name: weekly-people-review
description: Use when the user says "Monday people review" / "weekly people readout" / "what's happening across HR this week" — aggregates across the workspace by reading each other HR agent's `outputs.json`, summarizes what shipped, flags gaps, and recommends next moves with copy-paste handoff prompts.
---

# Weekly People Review

The weekly cross-agent rollup. The one skill in the workspace that
reads the other HR agents' output indexes (read-only) and gives the
founder a single narrative readout.

## When to use

- "Monday people review" / "weekly people readout" / "what's happening
  across HR this week" / "weekly people health check".
- Weekly routine (optional — the user wires it via the Routines tab
  for e.g. Monday 8:00).

## Steps

1. **Read people-context doc** (own file): `people-context.md`. The
   review frames everything against current values, leveling, open
   reqs, and the review-cycle rhythm — not generic HR KPIs.

2. **Read every peer agent's `outputs.json`** (read-only, handle
   missing gracefully):
   - `../recruiter/outputs.json`
   - `../people-ops/outputs.json`
   - `../performance-retention/outputs.json`
   - `outputs.json` (my own — HoP activity)

   If an agent isn't installed or the file is missing, note it as
   "no activity (not installed / no outputs yet)" and continue.

3. **Filter to the review window.** Default window: last 7 days by
   `createdAt` or `updatedAt`. If the user asks for a different
   window ("last 2 weeks", "since the last review cycle"), use that.

4. **Per agent, compute:**
   - Count of outputs this window, by `type`.
   - Notable shipped items (top 3 by recency). Include title + path
     + status.
   - Drafts still open (status = "draft") that have been stale
     >7 days.
   - Gaps — what this agent hasn't produced that the solo-founder
     stack expects. Examples:
     - `recruiter` — no candidate moves on an open req this week; no
       offer sent in N days; no interview loops scheduled.
     - `people-ops` — no policy questions answered (team may be
       silent, or ghosting the helpdesk); compliance items due this
       week not yet addressed; onboarding plan missing for a new
       hire starting soon.
     - `performance-retention` — no 1:1s collected this week; no
       retention score updated in 2+ weeks; review-cycle prep
       behind schedule; PIP status changes not reflected.

5. **Cross-cutting patterns.** Look for:
   - **Open-req drift** — a req in `people-context.md` with zero
     candidate movement for 2+ weeks in `recruiter/outputs.json`.
   - **Retention red alerts** — any `retention-score` entry flagged
     high risk with no `stay-conversation` follow-up.
   - **Compliance near-deadline** — `compliance-calendar` items
     within 14 days not yet closed.
   - **Review-cycle drift** — cycle date approaching in
     `people-context.md` but no prep artifacts in
     `performance-retention/outputs.json`.

6. **Draft the review (markdown, ~400-700 words).**

   1. **Window + TL;DR** — 3-5 bullets covering the week.
   2. **What shipped, per agent** — short section per agent
      (recruiter, people-ops, performance-retention, plus HoP). Include
      counts, top items, status. Mark missing agents explicitly.
   3. **Gaps** — bulleted. Severity-ranked. Example: "Performance &
      Retention hasn't collected 1:1s in 3 weeks — we're blind to
      flight risk."
   4. **Cross-cutting issues** — open-req drift, retention red
      alerts, compliance near-deadlines, review-cycle drift.
   5. **Recommended next moves** — exactly 3 concrete actions, each
      tagged with the owner agent AND a copy-paste handoff prompt
      the founder can drop into that agent's chat. Example:
      `[performance-retention] Paste: "Collect this week's 1:1
      check-ins across the team — we're 3 weeks behind."`
   6. **What to flip to ready** — list of `draft` outputs across
      agents that the founder should review and sign off on.

7. **Never invent metrics.** If an agent has no tracking data, don't
   make one up. The review reports what the agents actually produced
   — it's a production review, not an HRIS dashboard.

8. **Write atomically** to `reviews/{YYYY-MM-DD}.md` — `{path}.tmp`
   then rename. Date is today's ISO date.

9. **Append to `outputs.json`** (my own index). Read-merge-write
   atomically:

   ```json
   {
     "id": "<uuid v4>",
     "type": "review",
     "title": "People review — <YYYY-MM-DD>",
     "summary": "<2-3 sentences — what shipped, top gap, top next move>",
     "path": "reviews/<YYYY-MM-DD>.md",
     "status": "ready",
     "createdAt": "<ISO-8601>",
     "updatedAt": "<ISO-8601>"
   }
   ```

   (Reviews ship as `ready` — they're factual rollups, not drafts.)

10. **Summarize to user.** One paragraph: "This week {N} outputs
    across {agents shipping}. Biggest gap: {gap}. Biggest next move:
    {move}. Full review: {path}."

## Outputs

- `reviews/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "review"`.
