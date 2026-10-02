# Storyboard 00 — Manifesto (short cut)

**Purpose:** A three-beat statement of how AiForm Studio works — for WhatsApp status, Reels, TikTok and Shorts.
**Duration:** 15.0s · **Format:** 1080×1920, 30fps, silent
**Gold element:** "Noticed, not invented." (closing line)
**Composition:** `compositions/manifesto-short/`
**Output:** `renders/aiform-manifesto-short-vertical-v[n].mp4`
- v1: first cut (paper `#f3f2ef`, green mark, centred beats, 1.4s fades)
- v2: BRAND.md-compliant revision (this storyboard)

Separate from `01-manifesto.md`, which keeps the `aiform-manifesto-*` names.

---

| # | Time | On screen | Motion | Notes |
|---|------|-----------|--------|-------|
| 1 | 0.0–5.3s | "Most businesses / don't need / more software." (Fraunces 108px, ink) | Fade + 16px rise in 0.0–0.8s; fades out 4.9–5.3s | Left-aligned on the 108px edge. Full 0.8–4.9s (4.1s). |
| 2 | 5.18–10.0s | "They need what / actually fits / how they work." (Fraunces 108px, ink) | Rises in 5.18–5.78s as beat 1 finishes; fades out 9.6–10.0s | Same left edge as beat 1. Full 5.78–9.6s (3.82s). |
| 3 | 9.88–15.0s | Sign-off, centred: "Noticed, / not invented." (Fraunces 108px, gold) → mark (96px) → `aiformstudio.co.za` (Public Sans 34px, ink) | Line rises in 9.88–10.48s as beat 2 finishes → mark fades in 10.68–11.28s → URL rises in 11.48–12.08s | BRAND.md §10. Complete from 12.08s; holds 2.92s. |

Timing rules applied (BRAND.md §6): entrances power2.out, 0.6–0.8s, 16px rise (mark is fade only, §5);
exits power2.inOut, 0.4s; beat changes are staggered crossfades — the incoming scene starts 0.28s into
the exit, when the outgoing one is 82% faded (0.88s total, no empty frame); 0.2s between sign-off elements.

---

## Review checklist
- [ ] Mid-crossfade stills checked before full render: `render.mjs --stills 5.24 9.94`
- [ ] Gold appears once, on "Noticed, not invented." only
- [ ] Mark appears once, in the sign-off, native `#7A5A83`, 96px visible height
- [ ] ≥48px clear space around the mark (72px above, 48px to the URL)
- [ ] All text clear of the top 14% (269px) and bottom 18% (346px)
- [ ] Each beat holds long enough to read twice (0.4s/word, min 2s)
- [ ] Fonts load from `assets/fonts/`, not a CDN
