// Houston agent dashboard bundle — Performance & Retention.
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
  "name": "Performance & Retention",
  "tagline": "Weekly check-ins, retention scoring, review cycles, stay conversations, PIPs. Tone-sensitive drafts with mandatory escalation checks.",
  "accent": "rose",
  "useCases": [
    {
      "category": "Rhythm",
      "title": "Collect this week's 1:1 check-ins across the team",
      "blurb": "Who responded, who's quiet, themes, escalations.",
      "prompt": "Collect this week's 1:1 check-ins across the team.",
      "fullPrompt": "Collect this week's check-ins from every team member. Use the collect-checkins skill. Pull the roster from the connected HRIS via Composio (Gusto / Deel / Rippling — whichever is linked). Send the check-in prompt to each person via the connected Slack channel — use the default prompt from people-context.md, or the override I've configured. Collect responses over the window. Summarize into: who responded, who's quiet (2+ weeks silent flag), themes clustered (wins · blockers · concerns), and any responses flagged for escalation per people-context.md. Save to checkins/{YYYY-MM-DD}.md and log in outputs.json.",
      "description": "Per the HRIS roster, send a check-in prompt to each team member via connected Slack. Collect responses. Summarize — who's quiet, themes, flagged concerns.",
      "outcome": "A weekly check-in summary at checkins/{YYYY-MM-DD}.md with who's quiet and what themes emerged.",
      "skill": "collect-checkins",
      "tool": "Slack"
    },
    {
      "category": "Retention",
      "title": "Score retention risk across the team",
      "blurb": "GREEN / YELLOW / RED per person — signal reasoning on REDs.",
      "prompt": "Score retention risk across the team — who's a flight risk?",
      "fullPrompt": "Score retention risk across the entire team. Use the score-retention-risk skill. Fuse four signal families per person: engagement (check-in responsiveness trend, Slack activity, PR/commit cadence via connected engineering tools), sentiment (check-in tone, cross-team mentions, anonymous-feedback mentions), tenure milestones (approaching cliff vesting, post-promotion honeymoon, recent manager change), comp exposure (time since last comp review, gap vs market if people-context.md has comp bands). Classify GREEN / YELLOW / RED per person. For every RED flag, surface the specific signal combination that drove the score AND recommend draft-stay-conversation as the next move. Save to retention-scores/{YYYY-MM-DD}.md and log in outputs.json. Never share this publicly — founder-eyes-only.",
      "description": "Fuse engagement, sentiment, tenure, and comp signals per team member. Classify GREEN / YELLOW / RED. Recommend stay conversations for REDs — never shared publicly.",
      "outcome": "A retention score at retention-scores/{YYYY-MM-DD}.md with signal reasoning on every RED flag.",
      "skill": "score-retention-risk"
    },
    {
      "category": "Retention",
      "title": "Draft a stay conversation for someone flagged RED",
      "blurb": "Verbal 1:1 script — open, listen, surface, ask, propose.",
      "prompt": "Draft a stay conversation for {employee} — they flagged RED.",
      "fullPrompt": "Draft a stay conversation for {employee}. Use the draft-stay-conversation skill. Read people-context.md for voice + hard-no constraints (e.g. if 'we never counter-offer on resignations' is there, respect it). Read the dossier at ../people-ops/dossiers/{employee-slug}.md if it exists — otherwise work from the RED flag signals and recent check-ins. Draft a 1:1 SCRIPT (not an email) structured: open → listen → surface (what I noticed without accusing) → ask (what would make you stay) → propose (concrete levers the founder can actually pull — scope, title, project, comp if policy allows). Save to stay-conversations/{employee-slug}.md and log in outputs.json. Remind the founder in the summary: this is a prompt for a verbal 1:1 — don't send it.",
      "description": "A verbal 1:1 script (NOT an email). Open → listen → surface → ask → propose. Reads people-context.md for voice and hard-no constraints.",
      "outcome": "A stay-conversation script at stay-conversations/{employee-slug}.md — ready for your 1:1, not for sending.",
      "skill": "draft-stay-conversation"
    },
    {
      "category": "Reviews",
      "title": "Prep the Q{N} review cycle — templates + timeline",
      "blurb": "Self, manager, calibration doc, full timeline.",
      "prompt": "Prep the Q{N} review cycle — self-review, manager-review, calibration.",
      "fullPrompt": "Prep the upcoming review cycle. Use the prep-review-cycle skill. Read the review-cycle rhythm from people-context.md (annual / semi-annual / quarterly + next cycle date) and the current roster from the HRIS via Composio. Produce four artifacts: (1) self-review template scoped to our leveling framework, (2) manager-review template scoped to leveling + cycle rubric, (3) calibration doc giving a cross-team view for leveling consistency / comp bumps / promotion candidates, (4) timeline — self-reviews due → manager-reviews due → calibration meeting → comp letters → delivery conversations. Save to review-cycles/{cycle-slug}.md (e.g. 2026-q2) and log in outputs.json as status: draft. Do not publish until the founder approves the cycle structure.",
      "description": "Self-review + manager-review templates, a calibration doc, and the full timeline — all scoped to your leveling framework. Draft-only until you sign off.",
      "outcome": "A review-cycle package at review-cycles/{cycle-slug}.md with templates, calibration doc, and timeline.",
      "skill": "prep-review-cycle"
    },
    {
      "category": "Tough calls",
      "title": "Draft a PIP — with escalation check before drafting",
      "blurb": "Context → expectations → 30/60/90 → support → consequences.",
      "prompt": "Draft a PIP for {employee} — {performance concerns}.",
      "fullPrompt": "Draft a PIP for {employee}. Use the draft-pip skill. BEFORE drafting, run the mandatory escalation check: read the escalation-rules section of people-context.md, assess whether this case could trigger protected-class + pretextual-timing concerns (e.g. concerns arising within 30 days of a medical leave request, pregnancy disclosure, whistleblower report). If ANY trigger matches → STOP, do not draft the PIP, instead draft an escalation note to me naming the specific trigger and stating 'this case needs a human lawyer before any PIP is written.' If clear: read the employee dossier at ../people-ops/dossiers/{employee-slug}.md if it exists, then draft the PIP with structure Context → Expectations (tied to leveling) → Milestones (30 / 60 / 90 day) → Support (what I/their manager will provide) → Consequences. Save to pips/{employee-slug}.md and log in outputs.json with the escalation classification field (drafted / blocked-on-escalation / needs-lawyer). Never deliver without my sign-off.",
      "description": "Runs the escalation check first — if protected-class + pretextual-timing triggers fire, routes to a human lawyer and does NOT draft. Otherwise Context → Expectations → 30/60/90 → Support → Consequences.",
      "outcome": "A PIP draft at pips/{employee-slug}.md OR an escalation note if the case needs a lawyer.",
      "skill": "draft-pip"
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
