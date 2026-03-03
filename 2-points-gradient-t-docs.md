# 2 Points Gradient T — Developer Documentation

## Overview

A **transparency variant** of 2 Points Gradient. Same 960×540 landscape layout with dual-layer gradient (2-color at 72° + 1-color wash at 0°/50% opacity), but with the **cover image removed** and a **top-transparency mask** on the result section (Figma node 20404:44887). A checkerboard background visualizes transparency, with a toggle to show the actual image behind it.

**Live demo:** [2 Points Gradient T.html](https://cosminicus.github.io/Blurred-Image/2%20Points%20Gradient%20T.html)

---

## Layer Stack (Bottom to Top)

```
┌──────────────────────────────────────────────┐
│  Background: Checkerboard or Image           │  html/body background (toggle)
│  ┌────────────────────────────────────────┐  │
│  │  result-section (mask-image: top T)    │  │  ~90% visible at top → 100% at 50%
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Layer 1: Background #1b1c21     │  │  │  CSS background on container
│  │  │  ┌────────────────────────────┐  │  │  │
│  │  │  │  Layer 2: 2-Color Grad 72°│  │  │  │  dark → mid (diagonal)
│  │  │  │  ┌──────────────────────┐  │  │  │  │
│  │  │  │  │  Layer 3: Wash 50%   │  │  │  │  │  lightest → transparent (0°)
│  │  │  │  │  ┌────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Layer 4: Dim  │  │  │  │  │  │  #141414 at 20% opacity
│  │  │  │  │  └────────────────┘  │  │  │  │  │
│  │  │  │  └──────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## How It Differs from 2 Points Gradient

| Aspect | 2 Points Gradient | 2 Points Gradient T |
|--------|-------------------|---------------------|
| Cover image | 640×360, right-aligned with 3-mask composite | Removed |
| Top transparency | None | `mask-image` on result section (~10% fade at top) |
| Body background | Solid `#111` | Checkerboard (CSS) or image (toggle) |
| BG toggle | N/A | Switches between checkerboard and actual image |
| Total CSS layers | 5 (bg, gradient, wash, dimmer, image) | 4 (bg, gradient, wash, dimmer) |

---

## Top-Transparency Mask

Applied to `.result-section` via CSS `mask-image`:

```css
mask-image: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, white 50%);
```

- **Top edge**: 90% visible (10% transparent — background peeks through)
- **50% height**: fully opaque (no transparency below midpoint)
- Derived from Figma node 20404:44887

---

## Background Toggle

A small button in the controls section switches between two modes:

- **Checkers** (default): CSS checkerboard pattern — standard transparency indicator
- **Image**: The actual selected/uploaded image fills the full viewport via `document.documentElement` background, with body made transparent so the image shows through the mask

---

## Color Extraction

Same as 2 Points Gradient — all 6 Vibrant.js swatches sorted by luminance, distributed across 2 gradient layers:

```
Layer 2: linear-gradient(72deg, darkest 0%, middle 100%)
Layer 3: linear-gradient(0deg, lightest 0%, rgba(lightest, 0) 100%)  /* opacity: 0.5 */
```

---

## File Reference

```
2 Points Gradient T.html        — Demo page
2 Points Gradient T.css         — Styles (dual gradient + transparency mask + checkerboard)
2 Points Gradient T.js          — Logic (TMDB + Vibrant + BG toggle)
2-points-gradient-t-docs.md     — This file
```
