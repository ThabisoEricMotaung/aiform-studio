# Storyboard 01 — Manifesto

**Purpose:** State the studio's thesis in 15 seconds.
**Duration:** 15s · **Primary format:** 1080×1920 (then 1080×1080)
**Gold element:** "We build what your business actually needs." (sign-off line)
**Output:** `renders/aiform-manifesto-vertical-v1.mp4`

---

| # | Time | On screen | Motion | Notes |
|---|------|-----------|--------|-------|
| 1 | 0.0–1.5s | Eyebrow: `AIFORM / STUDIO` (muted) | Fade in, hold | Quiet opening. Paper background. |
| 2 | 1.5–5.0s | Statement: "Most businesses don't need more software." (ink, Fraunces) | Line rises in, word-group stagger | Below eyebrow, left-aligned. |
| 3 | 5.0–9.0s | Statement replaces previous: "They need something that fits how they actually work." (ink) | Crossfade | Same text edge as scene 2. |
| 4 | 9.0–11.5s | Thin green rule draws left→right. Below it: "Noticed, not invented." (green, Fraunces italic) | Rule draws 0.8s, then line fades in | The philosophy, stated once. |
| 5 | 11.5–15.0s | Sign-off: "We build what your business actually needs." (gold) → mark → `aiformstudio.co.za` | Sequential fades, centred | Shared sign-off from BRAND.md §10. Hold to end. |

---

## Claude Code prompt

```
/hyperframes Read BRAND.md, then storyboards/01-manifesto.md.
Build the manifesto video exactly as storyboarded, 1080x1920, 30fps.
Use assets/mark.svg and the local fonts in assets/fonts.
Gold only on the sign-off line. Show me a preview before rendering.
```

## Review checklist
- [ ] Gold appears once, on the sign-off line only
- [ ] Mark appears once, in the final scene, small
- [ ] Every line readable twice before it leaves
- [ ] Works on mute
- [ ] Text clear of top 14% / bottom 18%
