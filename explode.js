const Cesium = window.Cesium || globalThis.Cesium;

export class ExplodeManager {
  constructor(globeManager, layerManager) {
    this.globe = globeManager;
    this.viewer = globeManager.viewer;
    this.layers = layerManager;

    this.isExploded = false;
    this.spreadScale = 1.0;

    // Strict Nominal Base Altitudes
    this.baseAltitudes = {
      flood: 0,
      roads: 150,
      buildings: 300,
      confidence: 450,
      shelters: 600,
      route: 600
    };

    this.connectorLines = [];
    this.floatingLabels = [];
  }

  toggleExplode(buttonEl) {
    this.isExploded = !this.isExploded;
    if (buttonEl) {
      buttonEl.classList.toggle('active', this.isExploded);
      buttonEl.setAttribute('aria-pressed', this.isExploded);
      buttonEl.innerText = this.isExploded ? 'Collapse layers' : 'Explode layers';
    }

    this.animateExplosion(this.isExploded ? 600 : 500);
  }

  setSpreadScale(multiplier) {
    this.spreadScale = parseFloat(multiplier);
    if (this.isExploded) {
      this.applyAltitudes(this.spreadScale);
      this.updateConnectorsAndBadges(true);
      this.globe.requestRender();
    }
  }

  animateExplosion(durationMs) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetScale = this.isExploded ? this.spreadScale : 0.0;

    if (prefersReducedMotion) {
      this.applyAltitudes(targetScale);
      this.updateConnectorsAndBadges(this.isExploded);
      this.globe.requestRender();
      return;
    }

    const startTime = performance.now();
    const initialScale = this.isExploded ? 0.0 : this.spreadScale;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);
      const ease = this.easeInOutCubic(progress);

      const currentScale = initialScale + (targetScale - initialScale) * ease;
      this.applyAltitudes(currentScale);

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        this.updateConnectorsAndBadges(this.isExploded);
      }
      this.globe.requestRender();
    };

    requestAnimationFrame(step);
  }

  applyAltitudes(scale) {
    Object.keys(this.baseAltitudes).forEach(layerKey => {
      const targetAlt = this.baseAltitudes[layerKey] * scale;
      const list = this.layers.entities[layerKey] || [];

      list.forEach(ent => {
        if (ent.polygon) {
          ent.polygon.height = targetAlt;
          if (ent.polygon.extrudedHeight) {
            const h = ent.properties && ent.properties.depth ? ent.properties.depth.getValue() : 10;
            ent.polygon.extrudedHeight = targetAlt + h;
          }
        } else if (ent.polyline) {
          const originalPositions = ent.polyline.positions.getValue();
          if (originalPositions) {
            const updated = originalPositions.map(pos => {
              const carto = Cesium.Cartographic.fromCartesian(pos);
              return Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, targetAlt);
            });
            ent.polyline.positions = updated;
          }
        } else if (ent.point && ent.position) {
          const curPos = ent.position.getValue(Cesium.JulianDate.now());
          if (curPos) {
            const carto = Cesium.Cartographic.fromCartesian(curPos);
            ent.position = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, targetAlt);
          }
        }
      });
    });
  }

  updateConnectorsAndBadges(show) {
    // Clear old connector lines and badges
    this.connectorLines.forEach(l => this.viewer.entities.remove(l));
    this.connectorLines = [];

    this.floatingLabels.forEach(lbl => this.viewer.entities.remove(lbl));
    this.floatingLabels = [];

    if (!show) return;

    const centerLon = -95.3698;
    const centerLat = 29.7604;

    // Build vertical connector lines from elevated tiers to ground (Anatomy craft guidelines)
    const tierOffsets = [
      { name: 'Road network (+150m)', alt: 150 * this.spreadScale, offsetLat: -0.01 },
      { name: 'Infrastructure (+300m)', alt: 300 * this.spreadScale, offsetLat: 0.0 },
      { name: 'Shelters & route (+600m)', alt: 600 * this.spreadScale, offsetLat: 0.01 }
    ];

    tierOffsets.forEach(tier => {
      const bottom = Cesium.Cartesian3.fromDegrees(centerLon + 0.02, centerLat + tier.offsetLat, 0);
      const top = Cesium.Cartesian3.fromDegrees(centerLon + 0.02, centerLat + tier.offsetLat, tier.alt);

      // Vertical guide dashed line
      const line = this.viewer.entities.add({
        polyline: {
          positions: [bottom, top],
          width: 1,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString('#9C8D82').withAlpha(0.65),
            dashLength: 8.0
          })
        }
      });
      this.connectorLines.push(line);

      // Floating tier badge label
      const label = this.viewer.entities.add({
        position: top,
        label: {
          text: tier.name,
          font: '12px DM Sans, sans-serif',
          fillColor: Cesium.Color.fromCssColorString('#F2EBE3'),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString('#2C1F33').withAlpha(0.9),
          backgroundPadding: new Cesium.Cartesian2(8, 4),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
      this.floatingLabels.push(label);
    });

    this.globe.requestRender();
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
}
