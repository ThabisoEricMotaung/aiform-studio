# Storyboard 02 — How We Work

**Purpose:** Show prospects how AiForm Studio thinks before it builds.
**Duration:** ~40s · **Primary format:** 1080×1920 (then 1080×1080, 1920×1080 for the website)
**Gold element:** "Built around how your business works." (sign-off line)
**Output:** `renders/aiform-process-vertical-v1.mp4`

---

## Structure

Six steps, each its own short scene with the same layout: a green step number, a Fraunces
step name, and one plain Public Sans line explaining it. A thin green progress rule at the
top of the content area fills one-sixth per step, so viewers always know where they are.

| # | Time | On screen | Motion | Notes |
|---|------|-----------|--------|-------|
| 0 | 0.0–4.0s | Eyebrow `AIFORM / PROCESS` · Statement: "We don't start with technology." | Fade + rise | Sets up the contrast. |
| 1 | 4.0–9.0s | `01` · **Identify** · "Find the real problem, not the assumed one." | Number, name, line stagger in; rule fills 1/6 | |
| 2 | 9.0–14.0s | `02` · **Inspect** · "Look at how the work actually happens today." | Crossfade content; rule fills 2/6 | |
| 3 | 14.0–19.0s | `03` · **Test** · "Try the idea small before building it big." | As above; 3/6 | |
| 4 | 19.0–24.0s | `04` · **Build** · "Make only what the evidence supports." | As above; 4/6 | |
| 5 | 24.0–29.0s | `05` · **Observe** · "Watch how it's really used." | As above; 5/6 | |
| 6 | 29.0–34.0s | `06` · **Revise** · "Improve it from what we see." | As above; rule completes 6/6 | |
| 7 | 34.0–36.5s | All six names appear as a quiet vertical list (ink, small), the rule loops back to 01 | Names stagger in at 0.15s | Shows the process is a cycle, not a funnel. |
| 8 | 36.5–40.0s | Sign-off: "Built around how your business works." (gold) → mark → `aiformstudio.co.za` | Sequential fades, centred | BRAND.md §10. |

---

## Claude Code prompt

```
/hyperframes Read BRAND.md, then storyboards/02-process.md.
Build the process video as storyboarded, 1080x1920, 30fps.
Create one reusable step-scene component and drive it from the six steps,
so the layout is identical across steps. Gold only on the sign-off line.
Preview scene 1 and scene 7 first so I can check the layout before you build the rest.
```

## Review checklist
- [ ] All six step scenes share an identical layout and text edge
- [ ] Step numbers are green, not gold
- [ ] Progress rule reads clearly without colour
- [ ] Gold appears once, on the sign-off line only
- [ ] Total runtime under 45s
