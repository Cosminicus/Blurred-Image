# Vibrant Color Hero Component — Developer Documentation (V2)

## Overview

An alternative to the V1 blurred-image hero effect. Instead of using CSS `filter: blur()` on the source image, this version extracts **dominant colors** from the image using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) and renders a **linear gradient background** derived from those colors. The sharp foreground image with gradient fade mask remains identical to V1.

**No blur. No background image. Pure color gradient driven by the image palette.**

**Live demo:** [vibrant-colors.html](https://cosminicus.github.io/Blurred-Image/vibrant-colors.html)

---

## How It Differs from V1 (Blur Version)

| Aspect | V1 (`blurred-background.html`) | V2 (`vibrant-colors.html`) |
|--------|---------------------|---------------------|
| Background technique | CSS `filter: blur(531.25px)` on the image | Linear gradient from Vibrant.js palette |
| Background image used? | Yes (same image, blurred) | No (solid CSS gradient only) |
| External dependency | None | node-vibrant 3.1.6 via CDN |
| GPU load | Higher (blur shader + scale(3)) | Lower (solid gradient, no compositing) |
| Visual result | Soft, atmospheric blurred image | Clean, color-matched gradient |
| Layer 4 mask | Identical | Identical |
| Dimmer overlay | Identical | Identical |

---

## File Reference

```
blurred-background.html     — V1 demo (blurred image background)
style.css                   — V1 styles (blur + mask)
app.js                      — V1 logic (TMDB API + blur layers)
blurred-background-docs.md  — V1 documentation

vibrant-colors.html         — V2 demo (Vibrant color gradient)
style2.css                  — V2 styles (color gradient + mask)
app2.js                     — V2 logic (TMDB API + Vibrant extraction)
vibrant-colors-docs.md      — This file
```
