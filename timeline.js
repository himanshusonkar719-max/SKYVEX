export class TimelineManager {
  constructor(globeManager, layerManager) {
    this.globe = globeManager;
    this.layers = layerManager;

    this.isPlaying = false;
    this.currentTimeIndex = 0;
    this.maxTimeSteps = 24; // 24-hour storm simulation
    this.timer = null;

    // DOM Elements
    this.sliderEl = document.getElementById('floodScrubber');
    this.playBtnEl = document.getElementById('playPauseBtn');
    this.depthReadoutEl = document.getElementById('depthReadout');

    this.init();
  }

  init() {
    if (this.sliderEl) {
      this.sliderEl.addEventListener('input', (e) => {
        this.setTimeStep(parseInt(e.target.value, 10));
      });
    }

    if (this.playBtnEl) {
      this.playBtnEl.addEventListener('click', () => {
        this.togglePlay();
      });
    }

    this.updateDisplay(0);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.playBtnEl) {
      this.playBtnEl.innerText = this.isPlaying ? '❚❚' : '▶';
      this.playBtnEl.setAttribute('aria-label', this.isPlaying ? 'Pause flood progression' : 'Play flood progression');
    }

    if (this.isPlaying) {
      this.timer = setInterval(() => {
        const next = (this.currentTimeIndex + 1) % (this.maxTimeSteps + 1);
        this.setTimeStep(next);
      }, 750);
    } else {
      clearInterval(this.timer);
    }
  }

  setTimeStep(stepIndex) {
    this.currentTimeIndex = stepIndex;
    if (this.sliderEl) {
      this.sliderEl.value = stepIndex;
    }

    // Dynamic water depth model: peak stage up to 3.8m at hour 18
    const maxDepth = 3.8;
    const depthMeters = parseFloat(((Math.sin((stepIndex / this.maxTimeSteps) * Math.PI) * maxDepth)).toFixed(2));

    this.updateWaterExtrusion(depthMeters);
    this.updateDisplay(depthMeters);
  }

  updateWaterExtrusion(depthMeters) {
    const floodEntities = this.layers.entities.flood || [];
    floodEntities.forEach(f => {
      if (f.polygon) {
        f.polygon.extrudedHeight = depthMeters;
        if (f.properties && f.properties.depth) {
          f.properties.depth = depthMeters;
        }
      }
    });

    this.globe.requestRender();
  }

  updateDisplay(depth) {
    if (this.depthReadoutEl) {
      this.depthReadoutEl.innerText = `${depth.toFixed(1)} m`;
    }
  }
}
