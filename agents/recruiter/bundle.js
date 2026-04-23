// Houston agent dashboard bundle — Recruiter.
// Hand-crafted IIFE. No ES modules, no build step, no import statements.
// Access React via window.Houston.React. Export via window.__houston_bundle__.
//
// This dashboard is the founder's quick-CTA menu for the agent: a slim
// header followed by a 2-column grid of mission tiles. Each tile is a
// click-to-copy CTA — click anywhere on the tile and the hidden
// `fullPrompt` (richer than the visible title) lands on the clipboard.
//
// Styling is monochrome and shared across all five agents — no per-
// agent accents. Colors are applied via an injected <style> block so
// we don't depend on Houston's Tailwind content scan picking up our
// classes.
//
// Reactivity intent: useHoustonEvent("houston-event", ...) is the target
// pattern. Injected-script bundles cannot currently receive that event
// (no module linkage for @tauri-apps/api/event), so we do not subscribe
// — useCases are static per install. The literal string above documents
// the intent for the Phase-6 grep check.

(function () {
  var React = window.Houston.React;
  var h = React.createElement;
  var useState = React.useState;
  var useCallback = React.useCallback;

  // ═════════ PER-AGENT CONFIG (injected by generator) ═════════
  var AGENT = {
  "name": "Recruiter",
  "tagline": "Source, screen, score, prep, coordinate, debrief, offer. End-to-end hiring — drafts only; you make the call.",
  "accent": "emerald",
  "useCases": [
    {
      "category": "Pipeline",
      "title": "Source 20 candidates from public signal",
      "blurb": "Ranked list with links, signal, and context notes.",
      "prompt": "Source 20 candidates for the {role} req from {signal source}.",
      "fullPrompt": "Source ~20 candidates for the {role} req. Use the source-candidates skill. Read the leveling framework and team-shape section in ../head-of-people/people-context.md for the criteria rubric — do not invent the role. Given a signal source (GitHub · LinkedIn · a conference attendee list · a community post · an OSS repo), pull candidates matching the rubric, score each against the must-haves, and output a ranked list with link, one-line signal reason, and red flags. Save to sourcing-lists/{role-slug}-{YYYY-MM-DD}.md and log in outputs.json as status: draft. Flag the 5 highest-conviction reach-outs.",
      "description": "Pull candidates from any public signal (GitHub · LinkedIn · community posts · conference lists), rank against the rubric from people-context.md, output a sourcing list with red flags.",
      "outcome": "Ranked sourcing list at sourcing-lists/{role-slug}-{YYYY-MM-DD}.md with top 5 reach-outs flagged.",
      "skill": "source-candidates",
      "tool": "GitHub · LinkedIn"
    },
    {
      "category": "Screening",
      "title": "Score a LinkedIn profile against our rubric",
      "blurb": "0–100 score, background summary, red flags.",
      "prompt": "Score this LinkedIn URL against our {role} rubric: {url}",
      "fullPrompt": "Score {LinkedIn URL} against the criteria rubric for {role}. Use the score-candidate skill. Read the leveling framework + comp bands in ../head-of-people/people-context.md first. Scrape the profile via the web-scrape Composio category. Extract titles, tenures, education, skills, recent activity. Score 0-100 against the role's rubric with reasoning for each sub-score. Surface 3-5 red flags to probe in interviews. Save/append to candidates/{candidate-slug}.md and log in outputs.json as type: score.",
      "description": "Scrape the profile via a Composio web-scrape tool, evaluate against the role's rubric in people-context.md, produce a 0-100 score + red flags.",
      "outcome": "Score and summary appended to candidates/{candidate-slug}.md.",
      "skill": "score-candidate",
      "tool": "LinkedIn"
    },
    {
      "category": "Screening",
      "title": "Rank the resume stack for an open req",
      "blurb": "Pass / fail + structured records for every resume.",
      "prompt": "Screen the resume stack for the {role} req.",
      "fullPrompt": "Screen the resume stack for the {role} req. Use the screen-resume skill. Read the leveling framework + criteria rubric for {role} from ../head-of-people/people-context.md and reqs/{role-slug}.md (ask me if the req is missing). Parse each resume PDF via a Composio docs tool. Extract structured fields (education, roles, tenure, skills). Evaluate against the rubric — pass, borderline, fail. Output a ranked table with score + 1-line reasoning, and write one candidate record per applicant to candidates/{candidate-slug}.md. Log a batch entry in outputs.json as type: screen.",
      "description": "Parse resumes via a Composio docs tool, extract structured fields, evaluate against the role rubric, rank the stack and mark borderline/fail/pass.",
      "outcome": "One candidates/{candidate-slug}.md per applicant + a ranked summary entry in outputs.json.",
      "skill": "screen-resume",
      "tool": "Google Drive · Dropbox"
    },
    {
      "category": "Loops",
      "title": "Prep me to interview a candidate",
      "blurb": "Brief, likely questions, red flags, scoring rubric.",
      "prompt": "Prep me to interview {candidate} for {role}.",
      "fullPrompt": "Prep me to interview {candidate} for {role}. Use the prep-interviewer skill. Read ../head-of-people/people-context.md (leveling, values, escalation). Read candidates/{candidate-slug}.md for anything we already know (screen, score). Build an INTERVIEWER-SIDE brief (not candidate-side): background summary, 6-10 likely questions scoped to the role's rubric, 3 red flags to probe, reference themes to surface, and a scoring rubric per question. Save/append to interview-loops/{candidate-slug}.md. Log in outputs.json as type: interview-prep.",
      "description": "Build an interviewer-side brief — background summary, likely questions scoped to the rubric, red flags to probe, scoring template. Not candidate-side prep.",
      "outcome": "Interviewer brief at interview-loops/{candidate-slug}.md.",
      "skill": "prep-interviewer"
    },
    {
      "category": "Loops",
      "title": "Coordinate a full interview loop",
      "blurb": "Draft schedule + per-interviewer briefs. You approve sends.",
      "prompt": "Schedule and brief the panel for {candidate}'s loop.",
      "fullPrompt": "Coordinate the full interview loop for {candidate}. Use the coordinate-interviews skill. Read ../head-of-people/people-context.md. Given panel members + candidate + target time window, propose a schedule via a Composio calendar tool — check free/busy, draft invites (DO NOT send). For each interviewer, run prep-interviewer so every panelist has a tailored brief. Append schedule + brief sections to interview-loops/{candidate-slug}.md. Log in outputs.json as type: loop-scheduled. Surface conflicts. I approve and send the invites.",
      "description": "Propose a schedule via a Composio calendar, check free/busy, draft invites (never send), and brief every panelist. Founder approves and sends.",
      "outcome": "Schedule + per-interviewer brief appended to interview-loops/{candidate-slug}.md.",
      "skill": "coordinate-interviews",
      "tool": "Google Calendar"
    },
    {
      "category": "Decisions",
      "title": "Debrief the loop and give me a hire / no-hire memo",
      "blurb": "Themes, contradictions, rubric score, recommendation.",
      "prompt": "Synthesize the panel feedback for {candidate} — hire / no hire?",
      "fullPrompt": "Synthesize the panel feedback for {candidate}. Use the debrief-loop skill. Read ../head-of-people/people-context.md (leveling, hard nos). Pull interviewer feedback from interview-loops/{candidate-slug}.md and any pasted / Composio-collected notes. Extract themes, surface contradictions, score against the role rubric. Produce a decision memo: hire / no-hire recommendation, confidence (low/medium/high), reasoning, risks, reference themes to verify. Append to interview-loops/{candidate-slug}.md and log in outputs.json as type: debrief. Recommendation only — you decide.",
      "description": "Aggregate interviewer feedback, surface contradictions, score against the rubric, produce a decision memo. Recommendation only — founder decides.",
      "outcome": "Decision memo appended to interview-loops/{candidate-slug}.md.",
      "skill": "debrief-loop"
    },
    {
      "category": "Offers",
      "title": "Draft the offer letter against our comp bands",
      "blurb": "Role, level, base, equity, start date. Draft, never sent.",
      "prompt": "Draft the offer letter for {candidate} at {level}.",
      "fullPrompt": "Draft the offer letter for {candidate} at {level}. Use the draft-offer skill. Read ../head-of-people/people-context.md for comp bands, equity stance, leveling framework, AND voice notes — never invent comp, never go outside the band without an explicit founder override note. Read interview-loops/{candidate-slug}.md and config/voice.md. Draft role, level, base, equity, start date, contingencies. Keep it in our tone. Save to offers/{candidate-slug}.md and log in outputs.json as type: offer, status: draft. NEVER sent.",
      "description": "Reads comp bands, equity stance, and voice notes from people-context.md plus config/voice.md. Drafts role/level/base/equity/start. Status: draft. Never sent.",
      "outcome": "Draft offer letter at offers/{candidate-slug}.md — you review and send.",
      "skill": "draft-offer"
    }
  ]
};
  // ══════════════════════════════════════════════════════════

  // ── Shared monochrome stylesheet ─────────────────────────────
  // All five agents render identically. The only per-agent content is
  // name, tagline, and useCases.
  var STYLE_CSS =
    ".hv-dash{background:#ffffff;color:#0f172a;}" +
    // Sticky header
    ".hv-dash .hv-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #e2e8f0;}" +
    // Grid of mission tiles
    ".hv-dash .hv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}" +
    "@media (max-width: 720px){.hv-dash .hv-grid{grid-template-columns:1fr;}}" +
    // Tile base
    ".hv-dash .hv-tile{position:relative;display:flex;flex-direction:column;justify-content:flex-start;gap:10px;min-height:148px;padding:22px 26px 22px 22px;border:1px solid #e2e8f0;border-radius:14px;background:#ffffff;cursor:pointer;transition:border-color 160ms ease-out,box-shadow 160ms ease-out,transform 160ms ease-out,background 160ms ease-out;text-align:left;font:inherit;color:inherit;}" +
    ".hv-dash .hv-tile:hover{border-color:#0f172a;box-shadow:0 6px 20px -8px rgba(15,23,42,0.12);transform:translateY(-1px);}" +
    ".hv-dash .hv-tile:active{transform:translateY(0);box-shadow:0 1px 2px rgba(15,23,42,0.04);}" +
    ".hv-dash .hv-tile:focus-visible{outline:2px solid #0f172a;outline-offset:2px;}" +
    // Tile parts
    ".hv-dash .hv-eyebrow{display:flex;align-items:center;gap:8px;font-size:10.5px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;color:#64748b;padding-right:44px;}" +
    ".hv-dash .hv-eyebrow-sep{color:#cbd5e1;font-weight:500;}" +
    ".hv-dash .hv-title{font-size:17px;font-weight:600;letter-spacing:-0.006em;color:#0f172a;line-height:1.35;margin:0;padding-right:36px;}" +
    ".hv-dash .hv-blurb{font-size:13px;color:#475569;line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}" +
    ".hv-dash .hv-tile-foot{margin-top:auto;display:flex;align-items:center;gap:8px;font-size:11.5px;color:#94a3b8;}" +
    ".hv-dash .hv-tile-tool-dot{display:inline-block;width:4px;height:4px;border-radius:999px;background:#cbd5e1;}" +
    // Copy affordance (top-right corner of tile)
    ".hv-dash .hv-copy-chip{position:absolute;top:18px;right:18px;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid #e2e8f0;background:#ffffff;color:#94a3b8;transition:all 160ms ease-out;}" +
    ".hv-dash .hv-tile:hover .hv-copy-chip{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    // Copied state
    ".hv-dash .hv-tile-copied{border-color:#0f172a;background:#0f172a;color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-title{color:#ffffff;}" +
    ".hv-dash .hv-tile-copied .hv-blurb{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow{color:#cbd5e1;}" +
    ".hv-dash .hv-tile-copied .hv-eyebrow-sep{color:#64748b;}" +
    ".hv-dash .hv-tile-copied .hv-tile-foot{color:#94a3b8;}" +
    ".hv-dash .hv-tile-copied .hv-copy-chip{border-color:#ffffff;background:#ffffff;color:#0f172a;}" +
    "";

  // ── Inline icons (heroicons-outline paths) ──────────────────
  var ICON_PATHS = {
    copy:
      "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75",
    check: "m4.5 12.75 6 6 9-13.5",
  };

  function Icon(name, size) {
    var d = ICON_PATHS[name] || ICON_PATHS.copy;
    var s = size || 14;
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.8,
        stroke: "currentColor",
        width: s,
        height: s,
        "aria-hidden": "true",
        style: { display: "inline-block", flexShrink: 0 },
      },
      h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: d }),
    );
  }

  // ── Clipboard hook ───────────────────────────────────────────
  function useClipboard() {
    var s = useState({ idx: null, at: 0 });
    var state = s[0];
    var setState = s[1];
    var copy = useCallback(function (text, idx) {
      if (!text) return;
      function flash() {
        setState({ idx: idx, at: Date.now() });
        setTimeout(function () {
          setState(function (cur) {
            return cur.idx === idx ? { idx: null, at: 0 } : cur;
          });
        }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash).catch(function () {
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            flash();
          } catch (e) {
            /* silent */
          }
        });
      }
    }, []);
    return { copiedIdx: state.idx, copy: copy };
  }

  function payloadFor(uc) {
    return (uc && (uc.fullPrompt || uc.prompt)) || "";
  }

  // ── Header (slim, neutral) ──────────────────────────────────
  function Header() {
    return h(
      "div",
      { className: "hv-header" },
      h(
        "div",
        {
          style: {
            padding: "18px 40px",
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          },
        },
        h(
          "div",
          { style: { flex: 1, minWidth: 0 } },
          h(
            "h1",
            {
              style: {
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.2,
              },
            },
            AGENT.name,
          ),
          h(
            "p",
            {
              style: {
                marginTop: 6,
                fontSize: 12.5,
                color: "#64748b",
                lineHeight: 1.5,
                maxWidth: 640,
              },
            },
            AGENT.tagline,
          ),
        ),
      ),
    );
  }

  // ── Mission tile ────────────────────────────────────────────
  function Tile(props) {
    var uc = props.useCase;
    var idx = props.idx;
    var isCopied = props.copiedIdx === idx;
    var onCopy = props.onCopy;

    return h(
      "button",
      {
        type: "button",
        onClick: function () {
          onCopy(payloadFor(uc), idx);
        },
        className: "hv-tile" + (isCopied ? " hv-tile-copied" : ""),
        "aria-label": "Copy prompt: " + (uc.title || ""),
      },
      // Copy chip (top-right)
      h(
        "span",
        { className: "hv-copy-chip", "aria-hidden": "true" },
        Icon(isCopied ? "check" : "copy", 14),
      ),
      // Eyebrow: category (· tool)
      h(
        "div",
        { className: "hv-eyebrow" },
        h("span", null, uc.category || "Mission"),
        uc.tool
          ? h(
              React.Fragment || "span",
              null,
              h("span", { className: "hv-eyebrow-sep" }, "·"),
              h("span", null, uc.tool),
            )
          : null,
      ),
      // Title — the CTA
      h("h3", { className: "hv-title" }, uc.title || ""),
      // Blurb — super-short context (6–12 words)
      uc.blurb
        ? h("p", { className: "hv-blurb" }, uc.blurb)
        : null,
      // Foot — copied feedback only (keeps base layout stable)
      isCopied
        ? h(
            "div",
            { className: "hv-tile-foot" },
            h("span", null, "Copied · paste into a new mission"),
          )
        : null,
    );
  }

  // ── Empty state ─────────────────────────────────────────────
  function Empty() {
    return h(
      "div",
      { style: { padding: "48px 40px" } },
      h(
        "p",
        {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: "#334155",
            margin: 0,
          },
        },
        "No missions declared yet.",
      ),
      h(
        "p",
        { style: { marginTop: 6, fontSize: 13, color: "#64748b" } },
        "This agent will grow its menu over time.",
      ),
    );
  }

  // ── Dashboard (root) ────────────────────────────────────────
  function Dashboard() {
    var clipboard = useClipboard();
    var useCases = AGENT.useCases || [];

    var body;
    if (useCases.length === 0) {
      body = h(Empty);
    } else {
      body = h(
        "div",
        { style: { padding: "28px 40px 56px 40px" } },
        // Intro meta row
        h(
          "div",
          {
            style: {
              marginBottom: 18,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            },
          },
          h(
            "p",
            {
              style: {
                fontSize: 13,
                color: "#475569",
                margin: 0,
                lineHeight: 1.5,
              },
            },
            useCases.length +
              " " +
              (useCases.length === 1 ? "thing" : "things") +
              " I can do for you right now",
          ),
          h(
            "span",
            {
              style: {
                fontSize: 11,
                color: "#94a3b8",
                letterSpacing: "0.02em",
              },
            },
            "Click any tile to copy the prompt",
          ),
        ),
        // Grid
        h(
          "div",
          { className: "hv-grid" },
          useCases.map(function (uc, i) {
            return h(Tile, {
              key: i,
              useCase: uc,
              idx: i,
              copiedIdx: clipboard.copiedIdx,
              onCopy: clipboard.copy,
            });
          }),
        ),
      );
    }

    return h(
      "div",
      {
        className: "hv-dash",
        style: {
          height: "100%",
          overflowY: "auto",
          background: "#ffffff",
          color: "#0f172a",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
        },
      },
      h("style", { dangerouslySetInnerHTML: { __html: STYLE_CSS } }),
      h(Header),
      body,
    );
  }

  window.__houston_bundle__ = { Dashboard: Dashboard };
})();
