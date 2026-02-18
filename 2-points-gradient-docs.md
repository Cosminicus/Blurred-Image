# 2 Points Gradient — Developer Documentation

## Overview

A 960×540 landscape variant using a **dual-layer gradient** approach (Figma Vanilla 2.5, node 20019:47204). Instead of a single 3-color gradient, this design splits the color into two layers: a **2-color diagonal gradient** (72°) plus a **1-color vertical wash** at 50% opacity. This creates a warmer, softer feel with the lightest color washing up from the bottom.

**Live demo:** [2 Points Gradient.html](https://cosminicus.github.io/Blurred-Image/2%20Points%20Gradient.html)

---

## Layer Stack (Bottom to Top)

```
┌──────────────────────────────────────────────┐
│  Layer 1: Background (#1b1c21)               │  CSS background on container
│  ┌────────────────────────────────────────┐  │
│  │  Layer 2: 2-Color Gradient (72°)       │  │  dark → mid (diagonal)
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Layer 3: Color Wash (0°, 50%)   │  │  │  lightest → transparent (bottom-up)
│  │  │  ┌────────────────────────────┐  │  │  │
│  │  │  │  Layer 4: Dimmer (20%)     │  │  │  │  #141414 at 20% opacity
│  │  │  │  ┌──────────────────────┐  │  │  │  │
│  │  │  │  │  Layer 5: Masked Img │  │  │  │  │  640×360, right-aligned
│  │  │  │  └──────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## How It Differs from 3 Points Gradient

| Aspect | 3 Points Gradient | 2 Points Gradient |
|--------|-------------------|-------------------|
| Gradient layers | 1 (3-color at 60.64°) | 2 (2-color at 72° + 1-color wash at 0°) |
| Color stops on main gradient | 3 (dark/mid/light) | 2 (dark/mid) |
| Light color handling | Part of main gradient | Separate wash layer at 50% opacity |
| Visual effect | Uniform diagonal blend | Diagonal base + warm bottom-up glow |
| Total CSS layers | 4 | 5 |

---

## Color Extraction

Same luminance-sorted approach as 3 Points Gradient. All 6 Vibrant.js swatches are sorted by perceived brightness, then distributed across 2 gradient layers:

```
Layer 2: linear-gradient(72deg, darkest 0%, middle 100%)
Layer 3: linear-gradient(0deg, lightest 0%, rgba(lightest, 0) 100%)  /* opacity: 0.5 */
```

- **Gradient 1** (72°): darkest → middle — the main atmospheric gradient
- **Gradient 2** (0°, 50% opacity): lightest → transparent — a warm bottom-up wash

### CORS Cache Fix

Same `w185` sampling as 3 Points Gradient to avoid CORS cache poisoning.

---

## Image Mask

Identical to 3 Points Gradient — three 16-stop CSS gradient masks composed with `mask-composite: intersect` (left/top/bottom fades, sharp right edge).

---

## File Reference

```
2 Points Gradient.html      — Demo page
2 Points Gradient.css       — Styles (dual gradient + 3-mask composite)
2 Points Gradient.js        — Logic (TMDB API + Vibrant extraction)
2-points-gradient-docs.md   — This file
```
