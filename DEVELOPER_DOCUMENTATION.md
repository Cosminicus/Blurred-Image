# Blurred Image Hero Component — Developer Documentation

## Overview

A pure CSS/JS solution for the "Hero Detail Page" blurred background image effect, matching the Figma design (Vanilla 2.5). The effect displays a movie/show backdrop image with a heavy blur as the background, a dimmer overlay, and the sharp original image on top with a gradient fade mask — all using **zero server-side image processing**.

**Live demo:** Open `index.html` via a local server (see "Running the Demo" below).

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

## Integration Guide

### Minimal HTML Structure (Copy-Paste Ready)

```html
<!-- Hero container — fixed dimensions per breakpoint -->
<div class="hero-blur-container">
  <!-- Layer 2: Blurred background -->
  <div class="hero-blur-bg" style="background-image: url('IMAGE_URL')"></div>
  <!-- Layer 3: Dimmer -->
  <div class="hero-blur-dimmer"></div>
  <!-- Layer 4: Sharp image with gradient mask -->
  <img class="hero-blur-mask" src="IMAGE_URL" alt="Title">
</div>
```

**That's it.** Replace `IMAGE_URL` with any TMDB backdrop URL (or any image URL). No JavaScript required for the effect itself — only for dynamically setting the URL.

### Setting the Image via JavaScript

```javascript
function setHeroImage(imageURL) {
  // Blurred background
  document.querySelector('.hero-blur-bg').style.backgroundImage = 'url("' + imageURL + '")';
  // Sharp foreground
  document.querySelector('.hero-blur-mask').src = imageURL;
}

// Example: TMDB backdrop
setHeroImage('https://image.tmdb.org/t/p/w1280/backdrop_path_here.jpg');
```

### React/Next.js Example

```jsx
function HeroBlur({ imageUrl, title }) {
  return (
    <div className="hero-blur-container">
      <div
        className="hero-blur-bg"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="hero-blur-dimmer" />
      <img className="hero-blur-mask" src={imageUrl} alt={title} />
    </div>
  );
}

// Usage
<HeroBlur
  imageUrl={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
  title={movie.title}
/>
```

### Vue Example

```vue
<template>
  <div class="hero-blur-container">
    <div class="hero-blur-bg" :style="{ backgroundImage: `url(${imageUrl})` }" />
    <div class="hero-blur-dimmer" />
    <img class="hero-blur-mask" :src="imageUrl" :alt="title" />
  </div>
</template>
```

---

## CSS Specification (From Figma)

### Full CSS — Copy This Entire Block

```css
/* ============================================================
   HERO BLUR COMPONENT
   Container: 360x640 (mobile), adjust per breakpoint
   ============================================================ */

.hero-blur-container {
  position: relative;
  width: 360px;
  height: 640px;
  background: #000; /* Layer 1 */
  overflow: hidden;
}

/* Layer 2: Blurred Background
   - Uses the SAME image URL as the mask
   - blur(531.25px) from Figma spec
   - scale(3) prevents transparent edges from blur overflow */
.hero-blur-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: blur(531.25px);
  transform: scale(3);
  z-index: 1;
}

/* Layer 3: Dimmer Overlay
   - 40% black opacity dims the blurred background
   - Makes foreground image pop */
.hero-blur-dimmer {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

/* Layer 4: Sharp Image Mask
   - 360x467px from Figma spec
   - object-fit: cover crops the image to fill
   - Gradient mask fades top and bottom edges
   - Top fade: 0% → 40.81% (transparent → opaque)
   - Solid: 40.81% → 59.19% (fully visible)
   - Bottom fade: 59.19% → 100% (opaque → transparent) */
.hero-blur-mask {
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

## Figma Values Reference

| Property | Value | Source |
|----------|-------|--------|
| Container size | 360 x 640px | Figma frame |
| Blur radius | 531.25px | Figma Layer blur, Uniform |
| Blur layer scale | scale(3) | Compensates for blur edge transparency |
| Dimmer opacity | rgba(0,0,0,0.4) | Figma fill |
| Mask size | 360 x 467px | Figma Dev Mode |
| Mask position | top: 0, left: 0 | Figma layout |
| Gradient direction | 180deg (top to bottom) | Figma linear gradient |
| Gradient solid range | 40.81% → 59.19% | Figma color stops |
| Gradient fade range (top) | 0% → 40.81% | 16 stops, eased curve |
| Gradient fade range (bottom) | 59.19% → 100% | 16 stops, eased curve |

---

## TMDB Image Recommendations

### Which Image to Use

| TMDB Field | Size | Best For |
|------------|------|----------|
| `backdrop_path` | 1280x720 (16:9) | Both blur background AND mask (landscape, high detail) |
| `poster_path` | 500x750 (2:3) | Alternative for portrait-heavy designs |

### Recommended TMDB Image Sizes

```
Blur background: https://image.tmdb.org/t/p/w780{backdrop_path}   (good enough, loads faster)
Sharp mask:      https://image.tmdb.org/t/p/w1280{backdrop_path}  (full quality)
```

Using `w780` for the blur background is fine because it gets blurred beyond recognition anyway — saves bandwidth.

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

### Why This is Fast

1. **GPU-accelerated**: `filter: blur()` runs on the GPU as a fragment shader, not CPU
2. **Single image download**: Browser caches the image — both layers use the same URL
3. **No JavaScript rendering**: The blur is CSS-only, applied on paint and cached by the compositor
4. **No server processing**: No need to generate/store/serve pre-blurred images

### Optimization Tips

- Use `w780` TMDB size for the blurred layer (it's blurred anyway)
- Add `loading="lazy"` for below-the-fold hero sections
- The `transform: scale(3)` creates a composite layer — this is intentional and GPU-friendly
- The gradient mask is a single CSS property, zero runtime cost

### Performance on Low-End Devices

If blur performance is an issue on very old devices:
- Reduce blur from `531.25px` to `100px` — still looks great, less GPU work
- Reduce scale from `3` to `1.5`
- The effect degrades gracefully — worst case is slightly less blurred background

---

## Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| `filter: blur()` | 18+ | 6+ | 35+ | 12+ |
| `mask-image` | 120+ | 4+ (-webkit-) | 53+ | 120+ |
| `-webkit-mask-image` | 4+ | 4+ | N/A | 79+ |

Both `-webkit-mask-image` and `mask-image` are included for full coverage. The component works in all modern browsers (2020+).

---

## Responsive Breakpoints (Future)

Currently built for 360px mobile. For tablet/desktop, adjust these values:

```css
/* Tablet — 768px */
@media (min-width: 768px) {
  .hero-blur-container {
    width: 768px;
    height: 1024px;
  }
  .hero-blur-mask {
    width: 768px;
    height: 600px;
  }
}

/* Desktop — 1440px */
@media (min-width: 1440px) {
  .hero-blur-container {
    width: 100%;
    height: 800px;
  }
  .hero-blur-mask {
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
  index.html    — Demo page with TMDB search + manual upload
  style.css     — All styles including the hero blur component
  app.js        — Demo logic (TMDB API + file upload + applyLayers)
  DEVELOPER_DOCUMENTATION.md  — This file
```

---

## Common Questions

**Q: Do we need to pre-generate blurred images on the server?**
A: No. CSS `filter: blur()` handles it entirely on the client GPU.

**Q: Does this work with any image URL?**
A: Yes. Any publicly accessible image URL works — TMDB, S3, CDN, etc.

**Q: What about CORS?**
A: `<img>` tags and CSS `background-image` are not subject to CORS. Any image URL works without CORS headers. Only `fetch()`/`XMLHttpRequest` to the TMDB API needs CORS (which TMDB allows).

**Q: What if the image fails to load?**
A: The container shows Layer 1 (solid black background). The dimmer is always visible. Handle errors by showing a fallback UI on `img.onerror`.

**Q: Can I overlay text/buttons on top of this?**
A: Yes. Add elements inside the container with `z-index: 4` or higher. The detail page title, metadata, and action buttons all go on top of this hero component.

**Q: Can I animate the transition between movies?**
A: Yes. Add `transition: opacity 0.3s` to both `.hero-blur-bg` and `.hero-blur-mask`, then crossfade by swapping the image URL.

---

## Running the Demo

```bash
# Navigate to the project folder
cd "/path/to/Blured Image"

# Start a local server (required for TMDB API calls)
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

1. Type a movie name in the search bar and click Search
2. Click any result poster — the hero effect updates instantly
3. Or use "Upload Image" to test with any local image
