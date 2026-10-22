# Flood Impact 3D — Geospatial Intelligence

> **Interactive 3D Flood Inundation & Infrastructure Assessment Experience**  
> Built with CesiumJS, Vite, and strict design systems adhering to **Anatomy** & **UI-UX-Pro-Max** specifications.

---

## 🌊 Overview

A high-performance geospatial decision-support application analyzing urban flooding impacts on municipal infrastructure, arterial transit corridors, and emergency evacuation routes.

---

## 🎨 Design System & Visual Hierarchy

- **Fixed Palette:**
  - Background: `#1A1222`
  - Surface: `#2C1F33`
  - Surface 2: `#3A2A42`
  - Accent: `#B9A38B` (Focus ring & active states)
  - Accent Hover: `#D4C0A6`
  - Text: `#F2EBE3`
  - Muted Text: `#9C8D82`
- **Semantic Data Colors:**
  - Flood Inundation: `#4FA3D1` → `#1E5F8C`
  - Passable Roads: `#5FB878`
  - Impassable Infrastructure: `#E5534B`
  - Hazard Severity Tiers: `#7FB77E` / `#E8A03C` / `#D9453B`
- **Strict Scale Constraints:**
  - Spacing Scale: `4px, 8px, 12px, 16px, 24px, 32px, 48px` only.
  - Border Radius: `8px` for controls, `16px` for panels only.
  - Typography: **Fraunces** for headings and big metrics, **DM Sans** for all UI copy.
  - Font Sizes: exactly `12, 14, 16, 20, 28, 40 px`.
  - Sentence case labels with 2px accent focus rings.

---

## 📐 Core Features

1. **Signature Exploded Layers (`explode.js`)**
   - Lifts geo-layers into discrete vertical observation tiers:
     - Flood baseline: `0 m`
     - Road network: `+150 m`
     - Critical infrastructure: `+300 m`
     - Confidence grid: `+450 m`
     - Evacuation pathways & shelters: `+600 m`
   - Smooth 600ms cubic ease transitions.
   - Dashed vertical connector lines anchored to ground terrain.
   - Floating tier name badges with spread gap adjustment slider (`0.5x` to `2.0x`).

2. **3D Interactions & Flood Time Scrubber (`timeline.js`)**
   - 24-hour storm simulation scrubber with depth readout in meters.
   - Dynamic 3D water extrusion rising on terrain in real time.
   - Play / pause controls.

3. **Camera Presets & Keyboard Navigation (`globe.js`)**
   - `[1]` Top View
   - `[2]` 3D Tilt View
   - `[3]` Street Level
   - `[0]` Reset AOI
   - Dynamic sun-position shadows.

4. **Dynamic Evacuation Routing & Vehicle Selector (`layers.js`)**
   - Click anywhere on the map to calculate live evacuation route to nearest shelter.
   - Routing profiles: **Ambulance**, **High-water truck**, **Foot patrol** with 300ms transition.

5. **Hover & Selection Side Detail Panel (`ui.js`)**
   - Hover highlights feature with **+2m vertical lift**, outline, and tooltip.
   - Click opens side detail panel (not a modal) with depth, severity, confidence bar, and direct "Fly to" camera zoom.
   - One-click situation report JSON download.

---

## ⚡ Performance & Accessibility

- `requestRenderMode = true` and `maximumRenderTimeChange = Infinity` for minimal GPU idle overhead.
- Mobile resolution capping via `Math.min(window.devicePixelRatio, 1.2)`.
- Full `@media (prefers-reduced-motion)` fallback support.
- Responsive layout adapting to collapsible bottom-sheet on screens `< 768px`.

---

## 🚀 Quickstart

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build
npm run build
```
