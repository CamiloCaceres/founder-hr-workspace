---
name: score-candidate
description: Use when the user says "score {LinkedIn URL}" / "is this candidate a fit for {role}" / "rate this profile" — scrapes a LinkedIn (or public-profile) URL via a Composio web-scrape tool, extracts structured profile data, and scores 0-100 against the role's criteria rubric with a background summary and red-flag list.
---

# Score Candidate

## When to use

- Explicit: "score {LinkedIn URL}", "is this candidate a fit for
  {role}", "rate this profile", "0-100 on this LinkedIn".
- Implicit: kicked off by the founder after `source-candidates`
  returns a shortlist and they want a deeper read on a specific
  person; or as a dependency of `prep-interviewer` when no
  candidate record exists.
- One candidate per invocation. Batch = run me multiple times.

## Steps

1. **Read people-context doc** at
   `../head-of-people/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — please spend 5
   minutes with the Head of People (`define-people-context`)." Stop.
   Pull the leveling framework for the target level.
2. **Read the req.** Open `reqs/{role-slug}.md` for the criteria
   rubric. If missing, ask ONE targeted question ("What role are we
   scoring against? Paste the top 3 must-haves or I'll use what's
   in your open reqs.") and write `reqs/{role-slug}.md`.
3. **Parse the URL.** Accept a LinkedIn URL or any public-profile
   URL. Derive `{candidate-slug}` from the URL or stated name
   (`first-last`, kebab-case).
4. **Discover the scrape tool via Composio.** Run `composio search
   web-scrape` to find Firecrawl / generic-scrape slugs. If nothing
   is connected, tell the user which category to link and stop.
5. **Scrape the profile.** Execute the tool slug. Extract:
   - Current title + company + tenure
   - Prior roles (company, title, dates, tenure)
   - Education
   - Skills (stated + inferred from role / headline)
   - Recent activity (posts, publications, speaking)
   - Geo if stated
   Mark any ambiguous field UNKNOWN. If the scrape returns empty or
   gated, say so and ask for a paste of the profile summary.
6. **Score 0-100 against the rubric.** Break into 4-6 sub-scores
   (one per rubric criterion, e.g. level-fit, domain-fit,
   scope-signal, tenure-signal, culture-signal). Each sub-score is
   0-25 with a one-line reason citing profile evidence. Total ≤ 100.
7. **Produce outputs.** Background summary (3-5 sentences, plain),
   total score + sub-scores with reasoning, 3-5 red flags to probe
   in interviews (tenure pattern, scope mismatch, stated gaps).
   Never infer protected-class attributes.
8. **Write to `candidates/{candidate-slug}.md`.** If the file
   exists, append a new dated `## LinkedIn Score {YYYY-MM-DD}`
   section — never overwrite. If it doesn't exist, create it with
   a header stub then the score section. Atomic write
   (`*.tmp` → rename).
9. **Append to `outputs.json`** — add `{ id, type: "score", title,
   summary, path: "candidates/{candidate-slug}.md", status: "draft",
   createdAt, updatedAt }`, write atomically.
10. **Summarize to user** — one paragraph: total score, top 2
    reasons it's high/low, top 2 red flags, path to the candidate
    file.

## Never invent

- Every claim ties back to the profile scrape. If the profile is
  thin or gated, reduce confidence / ask for a paste.
- No guesses on geo, visa status, or protected-class attributes.
- If the tool errored, surface that explicitly — don't silently
  fall back to generic patterns.

## Outputs

- `candidates/{candidate-slug}.md` (appended; created if missing).
- Appends to `outputs.json` with type `score`.
