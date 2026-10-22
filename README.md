# SKYVEX // Cosmic Odyssey

> **Beyond the Boundaries of Earth.**  
> A futuristic, cinematic, interactive 3D space exploration web experience built with React, Three.js, Tailwind CSS, and Web Audio API.

---

## 🌌 Overview

**SKYVEX** combines scientific telemetry with a sci-fi interface to bring the cosmos to your screen. Explore the Solar System in real-time 3D, inspect deep-space destinations like relativistic black holes and spiral nebulae, follow humanity's landmark space missions, and calculate cosmological lookback time and light redshifts.

---

## ✨ Features

- **Cinematic 3D Hero World:** Interactive Three.js WebGL canvas with procedural banded atmosphere, Rayleigh scattering shader glow, Cassini-divided rings, and a 1,800-star particle field.
- **Interactive 3D Solar System:**
  - Real-time orbital motion for the Sun and 8 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn with rings, Uranus, Neptune).
  - Orbit pause/resume and simulation speed controls (`0.5x`, `1x`, `2x`, `4x`).
  - Dual perspective: 3D orbital perspective and top-down plan view.
  - Comprehensive planetary dossier with tabs for **Overview**, **Atmosphere**, and **Missions**.
  - Planet selector dock with highlighted Earth selection.
- **Explore the Cosmos:**
  - **Spiral Galaxies & Nebulae:** Logarithmic spiral galaxy canvas simulation.
  - **Black Holes & Event Horizons:** Relativistic accretion disk with Doppler beaming, photon sphere ring, and singularity shadow.
  - **Exoplanets & Strange Worlds:** Transit light-curve simulator with host star flares and atmospheric Rayleigh scattering.
  - Dedicated astrophysics detail modals with quantitative metrics.
- **Humanity Beyond Earth (Missions):**
  - Landmark missions: Apollo 11, Voyager 1, JWST, Artemis, Perseverance, and ISS.
  - Real-time ticking distance simulation for Voyager 1 into interstellar space.
  - Filter by `All`, `Active`, `Completed`, or `In Transit`.
- **Celestial Observatory:**
  - Deep-sky coordinate tracker (Right Ascension / Declination) for J2000.0 epoch targets.
  - Interactive cosmological lookback time and redshift ($z$) calculator.
- **Web Audio Interstellar Synthesizer:**
  - Binaural ambient cosmic drone generated in real-time via the Web Audio API with telemetry click feedback (muted by default for accessibility).
- **Accessibility & Performance:**
  - Full `@media (prefers-reduced-motion)` fallback support.
  - Dynamic GPU visibility observer to conserve power when canvases are out of view.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design Tokens
- **3D Graphics:** Three.js (WebGL) + HTML5 2D Canvas Shaders
- **Audio Engine:** Web Audio API (zero external audio file dependencies)
- **Icons:** Lucide React
- **Typography:** Orbitron (Headings) & Space Grotesk (Body) via Google Fonts

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SKYVEX

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛰️ Scientific References & Attribution

- **NASA Jet Propulsion Laboratory (JPL):** Planetary metrics, ephemeris data, and Voyager telemetry.
- **NASA Exoplanet Archive & ESA/Webb Science Institute:** Exoplanetary parameters and deep field spectrometry.
- **Event Horizon Telescope (EHT) Collaboration:** Black hole shadow and photon ring metrics.
- **Deep Space Network (DSN):** Real-time spacecraft communication baselines.

---

## 📜 License

MIT License. Designed and developed for the **SKYVEX** Cosmic Odyssey exploration program.
