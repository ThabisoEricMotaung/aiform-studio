# AiForm Studio — Video Brand Rules

Read this file before creating or editing any composition in this repo.
These rules extend AiForm Studio Document System v1.0 (Direction A — Editorial Studio) into motion.
If a creative idea conflicts with this file, this file wins.

---

## 1. Character

Videos should feel: calm, considered, precise, editorial, quietly confident, human.

Videos must NOT feel: loud, flashy, hype-driven, "AI SaaS", dark-mode tech, Canva template,
trendy for trend's sake, or overdecorated.

Test every decision against two questions:
1. Could this have come from any small-business video template? → If yes, not distinctive enough.
2. Is this trying too hard to look like a design studio? → If yes, simplify.

---

## 2. Colour

| Token   | Hex       | Use |
|---------|-----------|-----|
| paper   | `#FBF8F1` | Default background for every scene |
| ink     | `#1C1A16` | Primary text |
| green   | `#153A2C` | Structure: thin rules, labels, secondary emphasis, step numbers |
| muted   | `#726C5E` | Metadata, small labels, captions (never for key messages) |
| gold    | `#C1943A` | ONE semantic role per video (see §3) |
| mark    | `#7A5A83` | The AiForm mark only — never on text, rules or backgrounds |

Rules:
- Light theme only. No dark backgrounds, no gradients, no glows, no large blocks of brand colour.
- A full-bleed green scene is allowed at most once per video, and only if the storyboard calls for it.
- Video must stay legible with colour removed: hierarchy comes from size, weight and position, not colour.

---

## 3. Gold rule

Gold appears on exactly one element per video: **the closing line** (the thesis or call to action).
Nothing else is gold — not step numbers, not underlines, not icons, not transitions.
If a storyboard does not name a gold element, use no gold at all.

---

## 4. Typography

- **Fraunces** — headlines and statement lines. Weights 400–600. Never all-caps.
- **Public Sans** — labels, metadata, supporting lines, URLs. Weights 400–600.
- Labels use the slash-eyebrow convention, uppercase Public Sans with letter-spacing ~0.12em:
  `AIFORM / STUDIO`, `AIFORM / PROCESS`, `AIFORM / WORK`
- Bundle fonts locally in `assets/fonts/` (woff2) rather than loading from a CDN, so renders are
  deterministic and work offline.

Sizes for 1080×1920 (scale proportionally for other formats):

| Role            | Font        | Size     |
|-----------------|-------------|----------|
| Statement line  | Fraunces    | 88–110px |
| Supporting line | Public Sans | 40–48px  |
| Eyebrow label   | Public Sans | 28–32px  |
| URL / metadata  | Public Sans | 30–36px  |

- Maximum ~8 words on screen at once for statement lines.
- Left-aligned by default (editorial). Centre only for the final sign-off scene.
- Every line stays on screen long enough to read twice (rule of thumb: 0.4s per word, minimum 2s).

---

## 5. The AiForm mark

- Source file: `assets/mark.svg` — native purple `#7A5A83`, preserved exactly. Never recolour.
- Appears **once per video, in the final scene only**, small — like a publisher's signature.
- Size on 1080×1920: 64–96px tall. Never larger than 120px.
- Clear space: at least half the mark's height on every side.
- Never animated beyond a simple fade-in. No spinning, bouncing, morphing or reveals.

---

## 6. Motion

- Easing: `power2.out` / `power3.out` (GSAP) for entrances; `power2.inOut` for exits.
- Entrance: fade + small rise (16–24px), 0.6–0.9s.
- Exit: fade, 0.4–0.6s.
- Stagger between lines: 0.15–0.25s.
- Scene transitions: cut, or staggered crossfade — the outgoing scene is ~80% faded before the
  incoming one appears, total ≤0.9s, no empty frame. No wipes, zooms, glitches, whips, spins, 3D flips.
- Thin rules (1–2px, green) may draw left-to-right as a structural device.
- One thing moves at a time. Stillness is part of the style — hold finished frames for at least 1s.
- No particle effects, no kinetic-typography bounces, no stock "tech" overlays.

---

## 7. Layout and formats

| Format     | Size      | Use |
|------------|-----------|-----|
| Vertical   | 1080×1920 | WhatsApp status, Reels, TikTok, Shorts (primary) |
| Square     | 1080×1080 | LinkedIn, Instagram feed |
| Landscape  | 1920×1080 | Website, presentations |

- 30fps.
- Margins: ~10% left/right.
- Vertical safe area: keep all text out of the top 14% and bottom 18% (platform UI overlays these).
- Use a consistent left text edge across scenes in a video.

---

## 8. Sound

- Every video must work fully on mute — on-screen text carries the whole message.
- Default: no voiceover. Optional quiet, unobtrusive instrumental bed.
- If voiceover is added later: calm, measured, South African English; captions must match exactly.

---

## 9. Copy and honesty

- Voice: plain, observational, specific. Short sentences. No hype words
  ("revolutionary", "cutting-edge", "next-level", "game-changer", "seamless").
- Never invent client counts, metrics, testimonials, awards, years in business or team size.
- Every project shown carries its true status (Live / Delivered / Prototype / R&D).
- Only show client work the client has agreed to have used in marketing.
- No personal, financial or credential data visible in any screen capture
  (blur or crop dashboards, emails, phone numbers, bookings).
- URL in sign-off: `aiformstudio.co.za`.

---

## 10. Sign-off scene (shared by all videos)

Paper background, centred:
1. Closing line (Fraunces, gold) — the video's one gold element
2. Mark (`assets/mark.svg`, small)
3. `aiformstudio.co.za` (Public Sans, ink)

Hold for 2.5–3s. Fade in sequence: line → mark → URL.

---

## 11. Repo conventions

Video work lives in the website repo (`aiform-studio`), alongside the Next.js app:

```
aiform-studio/
├── BRAND.md
├── assets/
│   ├── mark.svg | mark.png   (native #7A5A83; a PNG is trimmed to its visible edge)
│   ├── fonts/                (Fraunces + Public Sans woff2, with their OFL licences)
│   └── captures/             (screen recordings for case studies — create when needed)
├── storyboards/
│   ├── 00-manifesto-short.md
│   ├── 01-manifesto.md
│   ├── 02-process.md
│   └── 03-case-study.md
├── compositions/             (one folder per video: index.html + render.mjs)
│   └── manifesto-short/
└── renders/                  (MP4 output — gitignored)
```

Render with `node compositions/<video>/render.mjs` (needs `playwright-core`, Chromium and ffmpeg;
see the script header). Add `--stills <seconds…>` to preview frames before a full render.

File names: `aiform-[video]-[format]-v[n].mp4` — e.g. `aiform-manifesto-vertical-v1.mp4`.
