import * as Cesium from 'cesium';

export class GlobeManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.aoi = {
      destination: Cesium.Cartesian3.fromDegrees(-95.3698, 29.7604, 1850.0), // Houston metro AOI
      orientation: {
        heading: Cesium.Math.toRadians(15.0),
        pitch: Cesium.Math.toRadians(-35.0),
        roll: 0.0
      }
    };

    this.viewer = null;
    this.init();
  }

  init() {
    const isMobile = window.innerWidth <= 768;

    this.viewer = new Cesium.Viewer(this.container, {
      terrainProvider: Cesium.createWorldTerrain ? Cesium.createWorldTerrain() : undefined,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      sceneModePicker: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      shadows: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity
    });

    const scene = this.viewer.scene;
    scene.globe.depthTestAgainstTerrain = true;
    scene.globe.baseColor = Cesium.Color.fromCssColorString('#1A1222');

    // Performance: Cap resolution on mobile to prevent GPU fill-rate throttling
    this.viewer.resolutionScale = isMobile 
      ? Math.min(window.devicePixelRatio, 1.2) 
      : Math.min(window.devicePixelRatio, 2.0);

    // Initial orbital vantage in space
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-95.3698, 29.7604, 12000000.0)
    });

    this.setupShortcuts();
  }

  requestRender() {
    if (this.viewer && this.viewer.scene) {
      this.viewer.scene.requestRender();
    }
  }

  playIntro(onComplete) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.viewer.camera.setView(this.aoi);
      this.requestRender();
      if (onComplete) onComplete();
      return;
    }

    // Orchestrated intro: Fly from space down to Area of Interest
    this.viewer.camera.flyTo({
      destination: this.aoi.destination,
      orientation: this.aoi.orientation,
      duration: 3.2,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      complete: () => {
        this.requestRender();
        if (onComplete) onComplete();
      }
    });
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case '1':
          this.flyToPreset('top');
          break;
        case '2':
          this.flyToPreset('tilt');
          break;
        case '3':
          this.flyToPreset('street');
          break;
        case '0':
          this.flyToPreset('reset');
          break;
      }
    });
  }

  flyToPreset(preset) {
    const centerLon = -95.3698;
    const centerLat = 29.7604;
    let target = {};

    switch (preset) {
      case 'top':
        target = {
          destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, 3200.0),
          orientation: { heading: 0.0, pitch: Cesium.Math.toRadians(-89.9), roll: 0.0 }
        };
        break;
      case 'tilt':
        target = {
          destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat - 0.02, 1400.0),
          orientation: { heading: 0.0, pitch: Cesium.Math.toRadians(-28.0), roll: 0.0 }
        };
        break;
      case 'street':
        target = {
          destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat - 0.005, 120.0),
          orientation: { heading: Cesium.Math.toRadians(25.0), pitch: Cesium.Math.toRadians(-8.0), roll: 0.0 }
        };
        break;
      case 'reset':
      default:
        target = this.aoi;
        break;
    }

    this.viewer.camera.flyTo({
      ...target,
      duration: 1.4,
      easingFunction: Cesium.EasingFunction.CUBIC_OUT,
      complete: () => this.requestRender()
    });
  }

  toggleShadows(enable) {
    this.viewer.shadows = enable;
    this.viewer.terrainShadows = enable ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
    this.requestRender();
  }
}
