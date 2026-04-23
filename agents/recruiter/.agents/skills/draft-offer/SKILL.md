---
name: draft-offer
description: Use when the user says "draft an offer for {candidate}" / "write the offer letter" / "offer letter for {candidate} at {level}" — reads comp bands + equity stance + leveling framework from people-context.md plus voice notes from both people-context.md and config/voice.md, drafts the offer letter, and saves as status draft. Never sent.
---

# Draft Offer

## When to use

- Explicit: "draft an offer for {candidate}", "write the offer
  letter", "offer letter for {candidate} at {level}".
- Prerequisite: a candidate record + debrief exist and the founder
  has decided to proceed with an offer.
- Always produces a **draft** — this skill never sends.

## Steps

1. **Read people-context doc** at
   `../head-of-people/people-context.md`. If missing or empty, tell
   the user: "I need your people context first — please spend 5
   minutes with the Head of People (`define-people-context`)." Stop.
   Pull the leveling framework, **comp bands** (base + equity range
   per level + location multipliers), equity stance, voice notes,
   and the hard nos (e.g. "never counter on resignations"). These
   are load-bearing.
2. **Read config**: `config/voice.md` for the hiring-voice tone
   (greeting / sign-off patterns, sentence length). If missing, ask
   ONE targeted question naming the best modality ("Connect your
   inbox via Composio so I can sample 2-3 past offers, or paste one
   past offer letter.") — then write voice.md and continue.
3. **Read candidate context.** Open
   `interview-loops/{candidate-slug}.md` for the debrief and any
   agreed level / scope signal. Open
   `candidates/{candidate-slug}.md` for background. If neither
   exists, tell the user to run `debrief-loop` first and stop.
4. **Confirm the offer terms with the founder.** ONE question if
   any are missing: "Confirm — level: {X}, base: {Y}, equity: {Z},
   start date: {D}, location: {L}. Override any of these? (Note:
   {Y} {Z} pulled from comp band {band-name} in people-context.md.)"
   If the founder overrides outside the band, require an explicit
   written reason and record it in the offer letter footer.
5. **Draft the offer letter.** Structure:
   - Salutation (voice-matched per `config/voice.md` +
     people-context voice notes).
   - Role, title, level, reporting line.
   - Base compensation (from comp band).
   - Equity — grant size, vesting schedule, cliff, type (ISO /
     NSO / RSU if stated in equity stance).
   - Start date + location / remote designation.
   - Benefits pointer ("per our benefits policy canon —
     people-context.md").
   - Contingencies (background check, reference check,
     authorization to work as applicable, signed IP / PIIA).
   - Deadline to accept.
   - Sign-off (voice-matched).
6. **Tone check.** Re-read the draft against the voice notes. If the
   tone drifts (too corporate, too casual, wrong sign-off style),
   revise before writing.
7. **Write to `offers/{candidate-slug}.md`** atomically
   (`*.tmp` → rename). Header the file with a metadata block:
   `{ level, base, equity, start, location, band, overrideReason? }`
   plus the full letter body.
8. **Append to `outputs.json`** — `{ id, type: "offer", title,
   summary, path: "offers/{candidate-slug}.md", status: "draft",
   createdAt, updatedAt }`, write atomically. **Status stays
   `draft` — never flipped to `ready` by this skill.**
9. **Summarize to user** — one paragraph: name, level, base,
   equity, start, path to the draft. End with: "This is a draft. I
   do not send offers. Review, edit, and send from your inbox."

## Never invent

- Never invent comp. Every number comes from the comp band in
  people-context.md (or an explicit founder override with a written
  reason captured in the letter footer).
- Never invent equity type or vesting. If equity stance is silent,
  surface UNKNOWN and ask.
- Never promise benefits not in the policy canon.
- Never commit a start date without founder confirmation.
- Never send. This skill drafts only.

## Outputs

- `offers/{candidate-slug}.md` — draft offer letter with metadata
  header.
- Appends to `outputs.json` with type `offer`, status `draft`.
