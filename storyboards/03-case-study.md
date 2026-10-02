# Storyboard 03 — Case Study Reel (reusable template)

**Purpose:** Show real, working AiForm builds — evidence, not claims.
**Duration:** 25–30s · **Primary format:** 1080×1920 (then 1080×1080)
**Gold element:** "Built around how [client/product] works." (sign-off line)
**Output:** `renders/aiform-case-[slug]-vertical-v1.mp4`

This is a template. Fill in the project block below for each reel.
The structure mirrors the Company Profile's evidence system:
Context → Observation → Response → Status.

---

## Project block (fill in per reel)

```
slug:           wanotuts
name:           WanoTuts
type:           Built for client        # or: Built by AiForm
status:         Live                    # Live / Delivered / Prototype / R&D
url:            [live site URL]
context:        [one line — who it's for]
observation:    [one line — the real problem noticed]
response:       [one line — what was built]
capture_flow:   [pages/screens to capture, in order]
consent:        [confirmed by client on date]   # required for client work
```

Suggested first two reels:
1. **WanoTuts** — built for client, Live. Capture: home → pricing → booking flow.
   Confirm with the client before publishing.
2. **AiForm Procure** — built by AiForm, Live. Capture: home → supplier directory → a SmartScore view.
   Use a test supplier account only; no real supplier data visible.

---

| # | Time | On screen | Motion | Notes |
|---|------|-----------|--------|-------|
| 1 | 0.0–3.0s | Eyebrow `AIFORM / WORK` · Project name (Fraunces) · Type + status tag (green outline tag, e.g. "Built for client · Live") | Fade + rise | Status tag never gold. |
| 2 | 3.0–7.0s | Context line: "[context]" | Crossfade | Plain, specific. |
| 3 | 7.0–11.0s | Small label `NOTICED` (muted) · Observation line: "[observation]" | Crossfade | The problem, in the client's terms. |
| 4 | 11.0–22.0s | Website capture inside a simple device frame (thin ink outline, no glossy mockup). Small caption above: "[response]" | Slow scroll through `capture_flow`; cut between pages | Use website-to-video capture. Calm scroll speed. Blur any personal data. |
| 5 | 22.0–24.5s | Status line: "Live at [url]" (ink, Public Sans) | Fade | Factual. Omit url if the project is a prototype or R&D. |
| 6 | 24.5–28.0s | Sign-off: "Built around how [name] works." (gold) → mark → `aiformstudio.co.za` | Sequential fades, centred | BRAND.md §10. |

---

## Claude Code prompt

```
/hyperframes Read BRAND.md, then storyboards/03-case-study.md.
Build a reusable case-study composition driven by the project block.
First reel: [slug]. Capture [url] following capture_flow, scrolling slowly.
Device frame: thin ink outline only. Status tag in green, never gold.
Gold only on the sign-off line. Preview before rendering.
```

## Review checklist
- [ ] Client consent recorded in the project block (client work only)
- [ ] True status shown; nothing implies more than exists
- [ ] No personal, booking, payment or credential data visible in captures
- [ ] Gold appears once, on the sign-off line only
- [ ] Mark appears once, in the final scene
