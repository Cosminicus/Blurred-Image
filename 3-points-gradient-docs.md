# 3 Points Gradient — Developer Documentation

## Overview

A 960×540 landscape variant of the Vibrant Color Hero effect, designed for TV/large-screen layouts (Figma Vanilla 2.5, node 19995:45860). Extracts **3 dominant colors** from the image using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) and renders a **diagonal linear gradient** (60.64°) from darkest to lightest.

**Live demo:** [3 Points Gradient.html](https://cosminicus.github.io/Blurred-Image/3%20Points%20Gradient.html)

---

## Layer Stack (Bottom to Top)

```
┌───────────────────────────────────────────┐
│  Layer 1: Background (#1b1c21)            │  CSS background on container
│  ┌─────────────────────────────────────┐  │
│  │  Layer 2: 3-Color Gradient (60.64°) │  │  dark → mid → light (diagonal)
│  │  ┌───────────────────────────────┐  │  │
│  │  │  Layer 3: Dimmer (20%)        │  │  │  #141414 at 20% opacity
│  │  │  ┌─────────────────────────┐  │  │  │
│  │  │  │  Layer 4: Masked Image  │  │  │  │  640×360, right-aligned
│  │  │  └─────────────────────────┘  │  │  │
│  │  └───────────────────────────────┘  │  │
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

---

## How It Differs from V2 (Mobile Vibrant Colors)

| Aspect | V2 (`vibrant-colors.html`) | 3 Points Gradient |
|--------|---------------------------|-------------------|
| Viewport | 360×640 (mobile portrait) | 960×540 (landscape TV) |
| Gradient direction | 180° (vertical) | 60.64° (diagonal) |
| Color selection | Hardcoded swatch preference | Luminance-sorted (darkest/mid/lightest) |
| Image position | Top-left, 360×467 | Right-aligned, 640×360, top: 32px |
| Dimmer opacity | 40% | 20% |
| Image mask | Single vertical fade | 3 composed masks (left/top/bottom) with `mask-composite: intersect` |
| Search results | 3-column portrait posters | 5-column landscape backdrops |
| Vibrant sampling | w342 (same as thumbnails) | w185 (avoids CORS cache poisoning) |

---

## Color Extraction

All 6 Vibrant.js palette swatches are collected, sorted by perceived luminance (`0.299R + 0.587G + 0.114B`), and the darkest, middle, and lightest are picked. This guarantees maximum contrast regardless of image color distribution.

```
Gradient: linear-gradient(60.64deg, darkest 0%, middle 50%, lightest 100%)
```

### CORS Cache Fix

Thumbnails use TMDB `w342` size. Vibrant.js sampling uses `w185` to avoid browser CORS cache poisoning (same URL loaded without CORS headers by `<img>` tags would taint the canvas).

---

## Image Mask

Three 16-stop CSS gradient masks composed with `mask-composite: intersect`:

- **Left fade** (270°) — right 50% opaque, left 50% fades out
- **Top fade** (0°) — bottom 84.69% opaque, top ~15% fades out
- **Bottom fade** (180°) — top 73.89% opaque, bottom ~26% fades out

Right edge stays sharp (image is right-aligned at `right: 0`).

---

## File Reference

```
3 Points Gradient.html      — Demo page
3 Points Gradient.css       — Styles (gradient + 3-mask composite)
3 Points Gradient.js        — Logic (TMDB API + Vibrant extraction)
3-points-gradient-docs.md   — This file
```
