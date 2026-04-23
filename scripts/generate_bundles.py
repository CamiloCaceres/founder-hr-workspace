#!/usr/bin/env python3
"""Generate bundle.js per HR agent from the template + houston.json useCases."""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BASE = REPO / "agents"
TEMPLATE = (Path(__file__).resolve().parent / "bundle_template.js").read_text()

# All four agents share a single monochrome palette per AGENT-DESIGN-PHILOSOPHY §9 —
# ACCENTS kept for future-proofing; template doesn't currently consume them.
ACCENTS = {
    "head-of-people": "indigo",
    "recruiter": "emerald",
    "people-ops": "amber",
    "performance-retention": "rose",
}

TAGLINES = {
    "head-of-people": "Values, leveling, comp stance, the Monday people review. I coordinate the other three HR agents through one shared people-context doc.",
    "recruiter": "Source, screen, score, prep, coordinate, debrief, offer. End-to-end hiring — drafts only; you make the call.",
    "people-ops": "Policy Q&A with escalation routing, first-90-days onboarding, approvals, compliance calendar. Legally-sensitive questions route to a human.",
    "performance-retention": "Weekly check-ins, retention scoring, review cycles, stay conversations, PIPs. Tone-sensitive drafts with mandatory escalation checks.",
}


def build_for(agent_id: str) -> tuple[str, int]:
    agent_dir = BASE / agent_id
    houston_json = json.loads((agent_dir / "houston.json").read_text())

    agent_config = {
        "name": houston_json["name"],
        "tagline": TAGLINES[agent_id],
        "accent": ACCENTS[agent_id],
        "useCases": houston_json.get("useCases", []),
    }

    injected = json.dumps(agent_config, indent=2, ensure_ascii=False)

    bundle_source = TEMPLATE.replace("{{AGENT_NAME}}", houston_json["name"])
    bundle_source = bundle_source.replace("{{AGENT_CONFIG}}", injected)

    target = agent_dir / "bundle.js"
    target.write_text(bundle_source)
    return str(target), len(bundle_source)


def verify(agent_id: str) -> bool:
    agent_dir = BASE / agent_id
    node_check = (
        "global.window={Houston:{React:{createElement:()=>null,"
        "useState:()=>[{idx:null,at:0},()=>{}],"
        "useEffect:()=>{},useCallback:f=>f}}};"
        "eval(require('fs').readFileSync('bundle.js','utf8'));"
        "console.log(Object.keys(window.__houston_bundle__));"
    )
    result = subprocess.run(
        ["node", "-e", node_check],
        cwd=agent_dir,
        capture_output=True,
        text=True,
    )
    ok = result.returncode == 0 and "Dashboard" in result.stdout
    status = "OK" if ok else "FAIL"
    print(f"  {status}  {result.stdout.strip() or result.stderr.strip()[:200]}")
    return ok


print("=== Generating bundle.js per HR agent ===")
all_ok = True
for agent_id in ACCENTS:
    path, size = build_for(agent_id)
    print(f"\n{agent_id}: wrote {size:,} bytes")
    if not verify(agent_id):
        all_ok = False

print("\n=== Summary ===")
print("All bundles verified." if all_ok else "SOME BUNDLES FAILED VERIFICATION.")
sys.exit(0 if all_ok else 1)
