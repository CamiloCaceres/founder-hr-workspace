---
name: screen-resume
description: Use when the user says "screen this resume" / "screen the stack for {role}" / "rank these resumes" — parses resume PDF(s) via a Composio docs tool, extracts structured fields, evaluates each against the role's criteria rubric, and writes one candidate record per applicant plus a ranked summary.
---

# Screen Resume

## When to use

- Explicit: "screen this resume", "screen the resume stack for
  {role}", "rank these resumes", "who's the strongest on this pile".
- Implicit: dependency of `prep-interviewer` / `debrief-loop` when
  no candidate record yet exists for a person in the loop.
- Single-resume and batch modes both supported — batch ranks the
  stack against each other.

## Steps

1. **Read people-context doc** at
   `../head-of-people/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — please spend 5
   minutes with the Head of People (`define-people-context`)." Stop.
   Pull the leveling framework for the target level.
2. **Read the req.** Open `reqs/{role-slug}.md` for the criteria
   rubric. If missing, ask ONE targeted question ("What's the level
   and the top 3 must-haves for {role}? I'll save a short rubric to
   `reqs/{role-slug}.md`."). Write it and continue.
3. **Locate the resumes.** If the user attached or connected a
   folder, run `composio search docs` to discover the docs tool slug
   (Google Drive / Dropbox) and list the PDFs. If paths were pasted,
   use those. If neither, ask ONE question naming the best modality
   ("Connect Google Drive / Dropbox from Integrations, or paste the
   resume files.") and stop.
4. **Parse each resume.** Execute the docs tool slug to extract text.
   For each, pull structured fields:
   - Name, contact
   - Education (school, degree, dates)
   - Roles (company, title, dates, tenure)
   - Skills (stated + inferred from role descriptions)
   - Notable projects / publications
   Mark any ambiguous field UNKNOWN — never infer.
5. **Evaluate against the rubric.** Per candidate, score each rubric
   criterion: **pass / borderline / fail**, with a one-line reason
   citing the resume evidence (or "not stated in resume" → UNKNOWN).
   Overall band: **pass / borderline / fail**. Surface 3-5 red flags
   (tenure pattern, skill-gap vs must-haves, unexplained gaps).
   Never flag protected-class attributes.
6. **Write a candidate record per applicant** to
   `candidates/{candidate-slug}.md` (slug = kebab-case
   `{first-last}`). If the file exists, append a new dated
   `## Screen {YYYY-MM-DD}` section — never overwrite prior sections.
   Atomic write (`*.tmp` → rename). Structure per section:
   Structured fields → Rubric scoring → Overall band → Red flags →
   Suggested next step (interview / reject with rationale).
7. **Write a ranked summary.** If screening more than one resume,
   build a table (name → band → 1-line reason → candidate file path)
   and include it in the outputs.json summary text.
8. **Append to `outputs.json`** — one entry per batch run with
   `{ id, type: "screen", title, summary, path: "candidates/",
   status: "draft", createdAt, updatedAt }`. Summary names the
   count, the bands, and the top 3 candidates.
9. **Summarize to user** — one paragraph: count screened, bands
   breakdown, top 3 named with file paths.

## Never invent

- If a skill / credential isn't stated, mark UNKNOWN — don't infer
  from company name.
- If a PDF fails to parse, say so and request a re-upload or paste.
- Never score on any protected-class attribute; only the rubric.

## Outputs

- `candidates/{candidate-slug}.md` per applicant (appended, never
  overwritten).
- Appends to `outputs.json` with type `screen`.
