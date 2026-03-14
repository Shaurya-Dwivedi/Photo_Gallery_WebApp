# Bug: Images / Cards Vanish in DevTools Responsive Mode

**Status:** Fixed  
**Components:** `src/components/PhotoCard.jsx`, `src/index.css`  
**Severity:** Medium — affects developer experience and responsive testing; not a production regression  
**Date Fixed:** 2026-03-14

---

## Summary

When toggling or resizing the viewport in Chrome/Edge DevTools device-emulation mode, many photo cards appeared completely blank — the card's background was invisible and images weren't showing, even though all 30 images were fully loaded in the browser (confirmed via `img.complete = true`, `naturalWidth = 600`).

---

## Reproduction Steps

1. Open `http://localhost:5173` in Chrome or Edge.
2. Wait for the gallery grid to finish loading all photos.
3. Open DevTools → click **Toggle device toolbar** (Ctrl + Shift + M).
4. Drag the viewport-width handle back and forth, or switch between device presets.
5. **Observed:** Many photo cards go blank — no image, no skeleton shimmer.

---

## Investigation

### What was initially suspected (wrong)

First hypothesis: `loading="lazy"` was causing the browser to cancel image network requests on viewport resize. This was addressed by removing `loading="lazy"` and adding `onError`. **This did not fix the bug.**

### What actually caused it (confirmed via browser inspection)

A browser console diagnostic (`img.complete`, `img.naturalWidth`, `getComputedStyle(card).opacity`) proved:

- **Images were fully loaded** (`complete=true`, `naturalWidth=600`)
- **The card's own computed opacity was 0** — the image inside was invisible because the entire **card element** was transparent, not the image

#### Root Cause: CSS `animation-fill-mode: both` + browser animation restart on resize

The card outer `<div>` had class `fade-up`:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fade-up {
  animation: fadeUp 0.35s ease-out both;  /* "both" = backwards + forwards */
}
```

The `both` fill-mode means `backwards` is included: **during the `animation-delay` period, the element is held at the `from` keyframe** (`opacity: 0`).

The stagger delay was applied via inline style:

```jsx
style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
```

**What happens on DevTools viewport resize:**

1. Browser receives viewport resize signal from DevTools
2. Browser performs CSS layout reflow
3. Chromium **restarts CSS animations** on elements with inline `animationDelay` styles when layout changes affect them
4. Each card is now in its delay period (`0ms` → `400ms` depending on index)
5. During the delay, `animation-fill-mode: backwards` holds the card at `opacity: 0`
6. Cards with longer delays (later in the grid, index 6+) appear blank for up to 400ms — but if the user keeps resizing, the delay resets every time → **permanently blank**

---

## Fix Applied

**The correct fix:** Replace the CSS animation with a **React-controlled entrance transition** driven by `useEffect` + `useState`. React state is **never reset by browser reflows or DevTools viewport changes** — once `show = true`, the card stays visible regardless of how many times the viewport is resized.

### `src/components/PhotoCard.jsx`

```diff
-import { useState } from 'react';
+import { useState, useEffect } from 'react';

 export default function PhotoCard({ photo, isFavourite, onToggleFavourite, index }) {
   const [animating, setAnimating] = useState(false);
   const [loaded, setLoaded] = useState(false);
+  const [show, setShow] = useState(false);

+  useEffect(() => {
+    const id = setTimeout(() => setShow(true), Math.min(index * 40, 400));
+    return () => clearTimeout(id);
+  }, []); // run once on mount only

   return (
     <div
-      className="fade-up group relative ..."
-      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
+      className={`group relative ... transition-all duration-[350ms] ease-out ${
+        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
+      }`}
     >
```

Also added during the same debugging session:

```diff
  <img
    src={...}
-   loading="lazy"
    onLoad={() => setLoaded(true)}
+   onError={() => setLoaded(true)}
  />
```

### `src/index.css`

- Removed `fade-up` from the `prefers-reduced-motion` media query (no longer used on cards)
- Left the `.fade-up` class and `@keyframes fadeUp` in place in case they're needed for other elements

---

## Why React State is the Right Solution

| Approach | Survives DevTools resize? | Notes |
|----------|--------------------------|-------|
| CSS `animation-fill-mode: both` + inline delay | ❌ | Browser restarts animation on reflow |
| CSS `animation-fill-mode: forwards` (no backwards) | ⚠️ | Cards flash (briefly visible during delay then jump to `from`) |
| `animation-delay: 0` (no stagger) | ⚠️ | Fixes bug but removes the staggered entrance effect |
| React `useEffect` + `useState` + CSS `transition` | ✅ | State only changes once (on mount); immune to all reflows |

---

## Verification

1. `npm run dev`, open `http://localhost:5173`
2. Let all images load
3. DevTools → Toggle device toolbar
4. Rapidly switch device presets / drag viewport width handle
5. ✅ All 30 photo cards should remain fully visible at every width

---

*Diagnosed using the `systematic-debugging` and `mobile-debugging` skills.*
