---
name: synthesize-employer-brand
description: Use when the user says "what's our employer brand" / "synthesize Glassdoor" / "leadership readout on what the team is saying" — pulls reviews from Glassdoor and other connected review / survey / feedback sources via Composio, clusters themes, and produces a leadership-only readout.
---

# Synthesize Employer Brand

Source template: Gumloop Workplace Reputation Analyzer, generalized
beyond Glassdoor to any review / survey / anonymous-feedback source
wired in via Composio. This is a leadership readout — it NEVER gets
published externally.

## When to use

- "what's our employer brand" / "synthesize Glassdoor" / "leadership
  readout on what the team is saying".
- "what are people saying about us publicly" / "review pulse".
- Ahead of a values refresh, an all-hands, or a board meeting.

## Steps

1. **Read people-context doc** (own file): `people-context.md`. The
   readout frames findings against our stated values, comp stance,
   and hard nos — not generic HR benchmarks.

2. **Discover review sources at runtime.** Do NOT hardcode tool
   names. Run `composio search reviews`, `composio search survey`,
   `composio search feedback` and pick the best connected slugs for
   each step. If nothing is connected, tell the user which category
   to link (reviews, survey, feedback — e.g. "connect Glassdoor or
   an anonymous-feedback platform in Integrations") and stop.

3. **Ask ONE scope question.** "Review window — last 30 days, last
   90 days, or last 12 months?" Default to 90 days if unsure. Also
   confirm which sources to include if multiple are connected.

4. **Fetch reviews / survey responses / feedback items.** Capture:
   source, date, rating (if any), full text, role / tenure if
   attached. Handle missing gracefully — some sources give ratings
   without text, others give text without attribution. Note the
   shape per source.

5. **Cluster themes.** Group verbatim mentions into clusters. Each
   cluster has:
   - A short label (e.g. "Compensation below market", "Remote
     flexibility praised", "Middle-management gap").
   - A count (how many items mentioned it).
   - 3-5 verbatim quotes (short excerpts) that exemplify the cluster.
   - Valence — positive / neutral / negative.

6. **Derive top strengths + top concerns + emerging patterns.**
   - **Top 3 strengths** — the highest-count positive clusters.
   - **Top 3 concerns** — the highest-count negative clusters.
   - **Emerging patterns** — clusters growing in the most recent
     window vs. earlier in the window. Signal change, not noise.

7. **Compare against stated values and hard nos.** Where does
   external sentiment contradict `people-context.md`? Where does it
   confirm? Flag contradictions as items the founder should address.

8. **Recommend responses.** Exactly 3 moves:
   - Where to double down (a strength worth amplifying internally).
   - Where to close a gap (a concern worth addressing in the next
     all-hands / values refresh / policy change).
   - Which concern routes to the founder vs routes to a specific
     agent vs routes to a human lawyer (if a concern is
     discrimination / harassment / wage-dispute shaped, flag it
     explicitly).

9. **Never invent.** Every cluster, every quote, every pattern must
   trace to a fetched review / response. Mark `UNKNOWN` where the
   source data is too thin (e.g. "Glassdoor has only 3 reviews —
   signal too weak to infer patterns; recommend wiring an
   anonymous-feedback platform").

10. **Structure the artifact (markdown, ~500-900 words).** File:
    `employer-brand-briefs/{YYYY-MM-DD}.md`. Sections:

    1. **Scope** — sources, date window, total item count.
    2. **Top 3 strengths** — label + count + best quote per.
    3. **Top 3 concerns** — label + count + best quote per.
    4. **Emerging patterns** — what's changing in the latest window.
    5. **Contradictions vs our stated values** — specific callouts.
    6. **Recommended responses** — the 3 moves.
    7. **Routing flags** — any item that needs founder / lawyer
       attention.
    8. **Sources** — list of sources pulled + item counts.

11. **Write atomically** — `{path}.tmp` then rename.

12. **Append to `outputs.json`.** Read-merge-write atomically:

    ```json
    {
      "id": "<uuid v4>",
      "type": "employer-brand",
      "title": "Employer brand brief — <YYYY-MM-DD>",
      "summary": "<2-3 sentences — top strength + top concern + top recommended move>",
      "path": "employer-brand-briefs/<YYYY-MM-DD>.md",
      "status": "draft",
      "createdAt": "<ISO-8601>",
      "updatedAt": "<ISO-8601>"
    }
    ```

13. **Summarize to user.** One paragraph: top strength, top concern,
    top recommended move, path to the brief. Remind them: leadership
    readout only — do NOT publish.

## Outputs

- `employer-brand-briefs/{YYYY-MM-DD}.md`
- Appends to `outputs.json` with `type: "employer-brand"`.
