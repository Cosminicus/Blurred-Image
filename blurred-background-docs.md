# Blurred Image Hero Component — Developer Documentation

## Overview

A pure CSS/JS solution for the "Hero Detail Page" blurred background image effect, matching the Figma design (Vanilla 2.5). The effect displays a movie/show backdrop image with a heavy blur as the background, a dimmer overlay, and the sharp original image on top with a gradient fade mask — all using **zero server-side image processing**.

**Live demo:** [blurred-background.html](https://cosminicus.github.io/Blurred-Image/blurred-background.html)

---

## Architecture

### The Effect is 100% Client-Side CSS

No backend processing, no Canvas, no ImageMagick/Sharp, no pre-generated blurred images. The browser's GPU handles everything via CSS `filter: blur()` and `mask-image`.

**One image URL drives the entire effect.** The same URL is used for both the blurred background and the sharp foreground. The browser downloads the image once and caches it.

### Layer Stack (Bottom to Top)

```
┌─────────────────────────────────────┐
│  Layer 1: Background (#000)         │  CSS background on container
│  ┌───────────────────────────────┐  │
│  │  Layer 2: Blurred Image       │  │  Same image, filter: blur(531.25px)
│  │  ┌─────────────────────────┐  │  │
│  │  │  Layer 3: Dimmer         │  │  │  rgba(0,0,0,0.4) overlay
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │  Layer 4: Mask     │  │  │  │  Sharp image + gradient fade
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## File Reference

```
blurred-background.html     — Demo page (blurred image background)
style.css                   — Styles (blur + mask)
app.js                      — Logic (TMDB API + blur layers)
blurred-background-docs.md  — This file

vibrant-colors.html         — Demo page (Vibrant color gradient)
style2.css                  — Styles (color gradient + mask)
app2.js                     — Logic (TMDB API + Vibrant extraction)
vibrant-colors-docs.md      — V2 documentation
```
