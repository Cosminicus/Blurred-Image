# Vibrant Color Hero Component — Developer Documentation (V2)

## Overview

An alternative to the V1 blurred-image hero effect. Instead of using CSS `filter: blur()` on the source image, this version extracts **dominant colors** from the image using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) and renders a **linear gradient background** derived from those colors. The sharp foreground image with gradient fade mask remains identical to V1.

**No blur. No background image. Pure color gradient driven by the image palette.**

**Live demo:** Open `index2.html` via a local server (see "Running the Demo" below).

---

## How It Differs from V1 (Blur Version)

| Aspect | V1 (`index1.html`) | V2 (`index2.html`) |
|--------|---------------------|---------------------|
| Background technique | CSS `filter: blur(531.25px)` on the image | Linear gradient from Vibrant.js palette |
| Background image used? | Yes (same image, blurred) | No (solid CSS gradient only) |
| External dependency | None | node-vibrant 3.1.6 via CDN |
| GPU load | Higher (blur shader + scale(3)) | Lower (solid gradient, no compositing) |
| Visual result | Soft, atmospheric blurred image | Clean, color-matched gradient |
| Layer 4 mask | Identical | Identical |
| Dimmer overlay | Identical | Identical |

---

## Architecture

### Color Extraction is Client-Side JavaScript

The [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) library analyzes a downscaled version of the image (TMDB `w342`) in-browser and returns a palette of six swatches: **Vibrant**, **Muted**, **DarkVibrant**, **DarkMuted**, **LightVibrant**, and **LightMuted**. Three of these are selected and mapped to a CSS `linear-gradient(180deg, ...)`.

### Layer Stack (Bottom to Top)

```
┌─────────────────────────────────────┐
│  Layer 1: Background (#000)         │  CSS background on container
│  ┌───────────────────────────────┐  │
│  │  Layer 2: Color Gradient      │  │  linear-gradient from Vibrant palette
│  │  ┌─────────────────────────┐  │  │
│  │  │  Layer 3: Dimmer         │  │  │  rgba(0,0,0,0.4) overlay
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │  Layer 4: Mask     │  │  │  │  Sharp image + gradient fade
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Gradient Color Mapping

The gradient flows **top to bottom** (`180deg`) using three palette swatches:

| Position | Swatch (with fallback chain) | Role |
|----------|-------------------------------|------|
| **0% (top)** | `Vibrant` > `LightVibrant` > `LightMuted` | Accent — brightest, most saturated |
| **50% (middle)** | `DarkVibrant` > `Vibrant` > `Muted` | Primary — rich mid-tone |
| **100% (bottom)** | `DarkMuted` > `Muted` > `DarkVibrant` | Secondary — darkest, grounds the composition |

If all swatches are `null` (extremely rare), hardcoded RGB fallbacks are used: `[40,40,60]`, `[20,20,40]`, `[0,0,0]`.

---

## Integration Guide

### Minimal HTML Structure (Copy-Paste Ready)

```html
<!-- Include Vibrant.js -->
<script src="https://cdn.jsdelivr.net/npm/node-vibrant@3.1.6/dist/vibrant.min.js"></script>

<!-- Hero container — fixed dimensions per breakpoint -->
<div class="hero-color-container">
  <!-- Layer 2: Color gradient background -->
  <div class="hero-color-bg" id="color-layer"></div>
  <!-- Layer 3: Dimmer -->
  <div class="hero-color-dimmer"></div>
  <!-- Layer 4: Sharp image with gradient mask -->
  <img class="hero-color-mask" id="sharp-image" src="IMAGE_URL" alt="Title">
</div>
```

### Setting the Image via JavaScript

```javascript
function setHeroImage(imageURL) {
  // Layer 4: sharp foreground
  document.getElementById('sharp-image').src = imageURL;

  // Layer 2: extract colors and set gradient
  Vibrant.from(imageURL)
    .getPalette()
    .then(function (palette) {
      var accent = palette.Vibrant || palette.LightVibrant || palette.LightMuted;
      var primary = palette.DarkVibrant || palette.Vibrant || palette.Muted;
      var secondary = palette.DarkMuted || palette.Muted || palette.DarkVibrant;

      var a = accent ? accent.getRgb() : [40, 40, 60];
      var p = primary ? primary.getRgb() : [20, 20, 40];
      var s = secondary ? secondary.getRgb() : [0, 0, 0];

      var toRgb = function (c) {
        return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')';
      };

      document.getElementById('color-layer').style.background =
        'linear-gradient(180deg, ' + toRgb(a) + ' 0%, ' + toRgb(p) + ' 50%, ' + toRgb(s) + ' 100%)';
    });
}

// Example: TMDB backdrop
setHeroImage('https://image.tmdb.org/t/p/w1280/backdrop_path_here.jpg');
```

### React/Next.js Example

```jsx
import { useEffect, useState } from 'react';
import Vibrant from 'node-vibrant';

function HeroColor({ imageUrl, title }) {
  const [gradient, setGradient] = useState('linear-gradient(180deg, #000 0%, #000 100%)');

  useEffect(() => {
    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        const accent = palette.Vibrant || palette.LightVibrant || palette.LightMuted;
        const primary = palette.DarkVibrant || palette.Vibrant || palette.Muted;
        const secondary = palette.DarkMuted || palette.Muted || palette.DarkVibrant;

        const toRgb = (swatch, fallback) => {
          const c = swatch ? swatch.getRgb() : fallback;
          return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
        };

        setGradient(
          `linear-gradient(180deg, ${toRgb(accent, [40,40,60])} 0%, ${toRgb(primary, [20,20,40])} 50%, ${toRgb(secondary, [0,0,0])} 100%)`
        );
      });
  }, [imageUrl]);

  return (
    <div className="hero-color-container">
      <div className="hero-color-bg" style={{ background: gradient }} />
      <div className="hero-color-dimmer" />
      <img className="hero-color-mask" src={imageUrl} alt={title} />
    </div>
  );
}

// Usage
<HeroColor
  imageUrl={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
  title={movie.title}
/>
```

### Vue Example

```vue
<template>
  <div class="hero-color-container">
    <div class="hero-color-bg" :style="{ background: gradient }" />
    <div class="hero-color-dimmer" />
    <img class="hero-color-mask" :src="imageUrl" :alt="title" />
  </div>
</template>

<script>
import Vibrant from 'node-vibrant';

export default {
  props: ['imageUrl', 'title'],
  data() {
    return { gradient: 'linear-gradient(180deg, #000 0%, #000 100%)' };
  },
  watch: {
    imageUrl: {
      immediate: true,
      handler(url) {
        Vibrant.from(url).getPalette().then((palette) => {
          const accent = palette.Vibrant || palette.LightVibrant || palette.LightMuted;
          const primary = palette.DarkVibrant || palette.Vibrant || palette.Muted;
          const secondary = palette.DarkMuted || palette.Muted || palette.DarkVibrant;
          const toRgb = (s, fb) => {
            const c = s ? s.getRgb() : fb;
            return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
          };
          this.gradient = `linear-gradient(180deg, ${toRgb(accent,[40,40,60])} 0%, ${toRgb(primary,[20,20,40])} 50%, ${toRgb(secondary,[0,0,0])} 100%)`;
        });
      }
    }
  }
};
</script>
```

---

## CSS Specification

### Full CSS — Copy This Entire Block

```css
/* ============================================================
   HERO COLOR COMPONENT (V2 — Vibrant gradient, no blur)
   Container: 360x640 (mobile), adjust per breakpoint
   ============================================================ */

.hero-color-container {
  position: relative;
  width: 360px;
  height: 640px;
  background: #000; /* Layer 1 */
  overflow: hidden;
}

/* Layer 2: Vibrant Color Gradient
   - No image, no blur
   - Background is set dynamically via JavaScript
   - Smooth 0.6s transition when gradient changes */
.hero-color-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #000;
  transition: background 0.6s ease;
}

/* Layer 3: Dimmer Overlay
   - Identical to V1
   - 40% black opacity dims the gradient background
   - Makes foreground image pop */
.hero-color-dimmer {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

/* Layer 4: Sharp Image Mask
   - Identical to V1 — same dimensions, same gradient fade
   - 360x467px
   - object-fit: cover crops the image to fill
   - Gradient mask fades top and bottom edges
   - Top fade: 0% → 40.81% (transparent → opaque)
   - Solid: 40.81% → 59.19% (fully visible)
   - Bottom fade: 59.19% → 100% (opaque → transparent) */
.hero-color-mask {
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  width: 360px;
  height: 467px;
  object-fit: cover;
  -webkit-mask-image: linear-gradient(180deg,
    rgba(255,255,255,0.00) 0%,
    rgba(255,255,255,0.01) 2.72%,
    rgba(255,255,255,0.04) 5.44%,
    rgba(255,255,255,0.08) 8.16%,
    rgba(255,255,255,0.15) 10.88%,
    rgba(255,255,255,0.23) 13.6%,
    rgba(255,255,255,0.33) 16.33%,
    rgba(255,255,255,0.44) 19.05%,
    rgba(255,255,255,0.56) 21.77%,
    rgba(255,255,255,0.67) 24.49%,
    rgba(255,255,255,0.77) 27.21%,
    rgba(255,255,255,0.85) 29.93%,
    rgba(255,255,255,0.92) 32.65%,
    rgba(255,255,255,0.96) 35.37%,
    rgba(255,255,255,0.99) 38.09%,
    #FFF 40.81%,
    #FFF 59.19%,
    rgba(255,255,255,0.99) 61.91%,
    rgba(255,255,255,0.96) 64.63%,
    rgba(255,255,255,0.92) 67.35%,
    rgba(255,255,255,0.85) 70.07%,
    rgba(255,255,255,0.77) 72.79%,
    rgba(255,255,255,0.67) 75.51%,
    rgba(255,255,255,0.56) 78.23%,
    rgba(255,255,255,0.44) 80.95%,
    rgba(255,255,255,0.33) 83.67%,
    rgba(255,255,255,0.23) 86.4%,
    rgba(255,255,255,0.15) 89.12%,
    rgba(255,255,255,0.08) 91.84%,
    rgba(255,255,255,0.04) 94.56%,
    rgba(255,255,255,0.01) 97.28%,
    rgba(255,255,255,0.00) 100%);
  mask-image: linear-gradient(180deg,
    rgba(255,255,255,0.00) 0%,
    rgba(255,255,255,0.01) 2.72%,
    rgba(255,255,255,0.04) 5.44%,
    rgba(255,255,255,0.08) 8.16%,
    rgba(255,255,255,0.15) 10.88%,
    rgba(255,255,255,0.23) 13.6%,
    rgba(255,255,255,0.33) 16.33%,
    rgba(255,255,255,0.44) 19.05%,
    rgba(255,255,255,0.56) 21.77%,
    rgba(255,255,255,0.67) 24.49%,
    rgba(255,255,255,0.77) 27.21%,
    rgba(255,255,255,0.85) 29.93%,
    rgba(255,255,255,0.92) 32.65%,
    rgba(255,255,255,0.96) 35.37%,
    rgba(255,255,255,0.99) 38.09%,
    #FFF 40.81%,
    #FFF 59.19%,
    rgba(255,255,255,0.99) 61.91%,
    rgba(255,255,255,0.96) 64.63%,
    rgba(255,255,255,0.92) 67.35%,
    rgba(255,255,255,0.85) 70.07%,
    rgba(255,255,255,0.77) 72.79%,
    rgba(255,255,255,0.67) 75.51%,
    rgba(255,255,255,0.56) 78.23%,
    rgba(255,255,255,0.44) 80.95%,
    rgba(255,255,255,0.33) 83.67%,
    rgba(255,255,255,0.23) 86.4%,
    rgba(255,255,255,0.15) 89.12%,
    rgba(255,255,255,0.08) 91.84%,
    rgba(255,255,255,0.04) 94.56%,
    rgba(255,255,255,0.01) 97.28%,
    rgba(255,255,255,0.00) 100%);
}
```

---

## Vibrant.js Palette Reference

### The Six Swatches

node-vibrant extracts up to six swatches from any image:

| Swatch | Description | Typical Use |
|--------|-------------|-------------|
| `Vibrant` | Most saturated, prominent color | Accent, highlights |
| `Muted` | Desaturated version of the dominant color | Subtle backgrounds |
| `DarkVibrant` | Dark, saturated color | Rich mid-tones, headers |
| `DarkMuted` | Dark, desaturated color | Deep backgrounds, shadows |
| `LightVibrant` | Light, saturated color | Bright accents |
| `LightMuted` | Light, desaturated color | Soft highlights |

Each swatch is either a `Swatch` object or `null`. Always use fallback chains.

### Swatch Methods

```javascript
swatch.getRgb()        // [r, g, b] — values 0-255
swatch.getHex()        // '#rrggbb'
swatch.getHsl()        // [h, s, l] — values 0-1
swatch.getPopulation() // number of pixels in this swatch
swatch.getTitleTextColor()  // '#rrggbbaa' — readable text color for titles
swatch.getBodyTextColor()   // '#rrggbbaa' — readable text color for body
```

### CORS Requirement for Vibrant.js

Unlike CSS `background-image` and `<img>` tags, **Vibrant.js needs to read pixel data** via an internal `<canvas>`. This means the image **must** be served with CORS headers (`Access-Control-Allow-Origin`). TMDB images include CORS headers, so they work out of the box. Local file uploads (blob URLs) also work without CORS.

If using a custom CDN, ensure the image server sends:
```
Access-Control-Allow-Origin: *
```

---

## TMDB Image Recommendations

### Which Image to Use

| TMDB Field | Size | Best For |
|------------|------|----------|
| `backdrop_path` | 1280x720 (16:9) | Sharp mask (landscape, high detail) |
| `poster_path` | 500x750 (2:3) | Alternative for portrait-heavy designs |

### Recommended TMDB Image Sizes

```
Color sampling:  https://image.tmdb.org/t/p/w342{backdrop_path}   (small, fast — only used for Vibrant)
Sharp mask:      https://image.tmdb.org/t/p/w1280{backdrop_path}  (full quality for Layer 4)
```

The `w342` size is used for Vibrant.js color extraction because it only needs enough pixels to identify dominant colors — smaller images process faster and use less memory.

### TMDB API Example

```javascript
// Fetch movie details
fetch('https://api.themoviedb.org/3/movie/533535?api_key=YOUR_KEY')
  .then(res => res.json())
  .then(movie => {
    const imageUrl = 'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path;
    setHeroImage(imageUrl);
  });
```

---

## Performance Notes

### Why This is Faster Than V1

1. **No GPU blur**: The heaviest operation in V1 (`filter: blur(531.25px)` + `scale(3)`) is completely eliminated
2. **No background image at all**: Layer 2 is a pure CSS gradient — zero image decoding, zero compositing
3. **Small sample image**: Vibrant.js processes a `w342` (342px wide) image, not the full `w1280`
4. **One-time extraction**: Colors are extracted once on image load, then it's a static CSS gradient
5. **Smooth transitions**: The `transition: background 0.6s ease` on `.color-layer` provides a smooth crossfade between gradients when switching movies

### Performance Cost of Vibrant.js

- Library size: ~17KB gzipped (loaded from CDN)
- Extraction time: ~20-50ms for a `w342` image (runs on the main thread)
- For Web Worker support, use `Vibrant.from(url).useQuantizer(Vibrant.Quantizer.WebWorker)` to offload to a worker

### Optimization Tips

- Always use `w342` or smaller for Vibrant sampling — color accuracy is identical to `w1280`
- The gradient transition is CSS-only after extraction — zero runtime cost
- Vibrant.js caches nothing; if you switch between movies frequently, consider caching palette results in a `Map`

---

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| `linear-gradient` | 26+ | 6.1+ | 16+ | 12+ |
| `mask-image` | 120+ | 4+ (-webkit-) | 53+ | 120+ |
| `-webkit-mask-image` | 4+ | 4+ | N/A | 79+ |
| `canvas` (for Vibrant) | 4+ | 3.1+ | 2+ | 12+ |
| `Promise` (for Vibrant) | 32+ | 8+ | 29+ | 12+ |

The component works in all modern browsers (2020+). Vibrant.js requires `<canvas>` and `Promise` support, both universally available.

---

## Responsive Breakpoints (Future)

Currently built for 360px mobile. For tablet/desktop, adjust these values:

```css
/* Tablet — 768px */
@media (min-width: 768px) {
  .hero-color-container {
    width: 768px;
    height: 1024px;
  }
  .hero-color-mask {
    width: 768px;
    height: 600px;
  }
}

/* Desktop — 1440px */
@media (min-width: 1440px) {
  .hero-color-container {
    width: 100%;
    height: 800px;
  }
  .hero-color-mask {
    width: 100%;
    height: 600px;
  }
}
```

The gradient mask percentages stay the same — they're relative to the element height.

---

## File Reference

```
/Blured Image/
  index1.html     — V1 demo (blurred image background)
  style.css       — V1 styles (blur + mask)
  app.js          — V1 logic (TMDB API + blur layers)
  DEVELOPER_DOCUMENTATION.md      — V1 documentation

  index2.html     — V2 demo (Vibrant color gradient background)
  style2.css      — V2 styles (color gradient + mask)
  app2.js         — V2 logic (TMDB API + Vibrant extraction + gradient)
  DEVELOPER_DOCUMENTATION_V2.md   — This file
```

---

## External Dependency

| Library | Version | CDN URL | Size |
|---------|---------|---------|------|
| node-vibrant | 3.1.6 | `https://cdn.jsdelivr.net/npm/node-vibrant@3.1.6/dist/vibrant.min.js` | ~17KB gzip |

Loaded via `<script>` tag in `index2.html`. Exposes a global `Vibrant` object. No build step required.

---

## Common Questions

**Q: Do we still need the blurred image in the background?**
A: No. V2 replaces the blurred image entirely with a CSS gradient. The background is pure color — no image is rendered behind the mask.

**Q: Does this work with any image URL?**
A: Yes, as long as the image server sends CORS headers (`Access-Control-Allow-Origin`). TMDB and most CDNs do this by default. Local uploads (blob URLs) always work.

**Q: What if Vibrant.js fails to extract colors?**
A: A fallback gradient `linear-gradient(180deg, #1a1a2e 0%, #000 100%)` is applied. The sharp image and dimmer still display normally.

**Q: What if a swatch is null?**
A: Each color position has a fallback chain (e.g., `Vibrant > LightVibrant > LightMuted`). If the entire chain is null, hardcoded dark RGB values are used. The gradient always renders.

**Q: Can I switch between V1 (blur) and V2 (gradient) at runtime?**
A: They are separate pages with separate CSS/JS. To offer both, implement a toggle that swaps the Layer 2 element and its logic. The mask (Layer 4) and dimmer (Layer 3) are identical and can be shared.

**Q: Can I use a radial gradient instead of linear?**
A: Yes. Change `linear-gradient(180deg, ...)` to `radial-gradient(ellipse at 50% 0%, ...)` in `app2.js` line 62. No CSS changes needed — the `.color-layer` accepts any valid `background` value.

**Q: Can I overlay text/buttons on top of this?**
A: Yes. Identical to V1 — add elements inside the container with `z-index: 4` or higher.

**Q: Can I animate the transition between movies?**
A: It already animates. The `.color-layer` has `transition: background 0.6s ease`, so gradient changes crossfade smoothly when a new movie is selected.

---

## Running the Demo

```bash
# Navigate to the project folder
cd "/path/to/Blured Image"

# Start a local server (required for TMDB API calls + Vibrant CORS)
python3 -m http.server 8080

# Open V2 in browser
open http://localhost:8080/index2.html
```

1. Type a movie name in the search bar and click Search
2. Click any result poster — the gradient background updates with the movie's dominant colors
3. Or use "Upload Image" to test with any local image
