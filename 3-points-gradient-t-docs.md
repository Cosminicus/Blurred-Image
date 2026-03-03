# 3 Points Gradient T — Developer Documentation

## Overview

A **transparency variant** of 3 Points Gradient. Same 960×540 landscape layout and 3-color diagonal gradient (60.64°), but with the **cover image removed** and a **top-transparency mask** applied to the result section (Figma node 20404:44887). A checkerboard background visualizes the transparent area, with a toggle to switch to the actual image behind it.

**Live demo:** [3 Points Gradient T.html](https://cosminicus.github.io/Blurred-Image/3%20Points%20Gradient%20T.html)

---

## Layer Stack (Bottom to Top)

```
┌───────────────────────────────────────────┐
│  Background: Checkerboard or Image        │  html/body background (toggle)
│  ┌─────────────────────────────────────┐  │
│  │  result-section (mask-image: top T) │  │  ~90% visible at top → 100% at 50%
│  │  ┌───────────────────────────────┐  │  │
│  │  │  Layer 1: Background #1b1c21  │  │  │  CSS background on container
│  │  │  ┌─────────────────────────┐  │  │  │
│  │  │  │  Layer 2: 3-Color Grad  │  │  │  │  dark → mid → light (60.64°)
│  │  │  │  ┌───────────────────┐  │  │  │  │
│  │  │  │  │  Layer 3: Dimmer  │  │  │  │  │  #141414 at 20% opacity
│  │  │  │  └───────────────────┘  │  │  │  │
│  │  │  └─────────────────────────┘  │  │  │
│  │  └───────────────────────────────┘  │  │
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

---

## How It Differs from 3 Points Gradient

| Aspect | 3 Points Gradient | 3 Points Gradient T |
|--------|-------------------|---------------------|
| Cover image | 640×360, right-aligned with 3-mask composite | Removed |
| Top transparency | None | `mask-image` on result section (~10% fade at top) |
| Body background | Solid `#111` | Checkerboard (CSS) or image (toggle) |
| BG toggle | N/A | Switches between checkerboard and actual image |
| Total CSS layers | 4 (bg, gradient, dimmer, image) | 3 (bg, gradient, dimmer) |

---

## Top-Transparency Mask

Applied to `.result-section` via CSS `mask-image`:

```css
mask-image: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, white 50%);
```

- **Top edge**: 90% visible (10% transparent — background peeks through)
- **50% height**: fully opaque (no transparency below midpoint)
- Derived from Figma node 20404:44887 (SVG mask: black@48% base + white gradient 90%→100%)

---

## Background Toggle

A small button in the controls section switches between two modes:

- **Checkers** (default): CSS checkerboard pattern on `html, body` — standard transparency indicator
- **Image**: The actual selected/uploaded image fills the full viewport via `document.documentElement` background, with body made transparent so the image shows through the mask

---

## Color Extraction

Same as 3 Points Gradient — all 6 Vibrant.js swatches sorted by luminance, darkest/middle/lightest picked for the 3-stop gradient at 60.64°.

---

## File Reference

```
3 Points Gradient T.html        — Demo page
3 Points Gradient T.css         — Styles (transparency mask + checkerboard)
3 Points Gradient T.js          — Logic (TMDB + Vibrant + BG toggle)
3-points-gradient-t-docs.md     — This file
```
