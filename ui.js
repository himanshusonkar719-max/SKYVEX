const Cesium = window.Cesium || globalThis.Cesium;

export class UIManager {
  constructor(globeManager) {
    this.globe = globeManager;
    this.tooltipEl = document.getElementById('cesiumTooltip');
    this.detailPanelEl = document.getElementById('detailPanel');
    this.selectedEntity = null;
  }

  setLayerManager(layerManager) {
    this.layers = layerManager;
    this.bindEvents();
  }

  bindEvents() {
    // Layer Visibility Checkboxes
    document.querySelectorAll('[data-layer-toggle]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const layer = e.target.getAttribute('data-layer-toggle');
        this.layers.setLayerVisibility(layer, e.target.checked);
      });
    });

    // Layer Opacity Sliders
    document.querySelectorAll('[data-opacity-slider]').forEach(sld => {
      sld.addEventListener('input', (e) => {
        const layer = e.target.getAttribute('data-opacity-slider');
        this.layers.setLayerOpacity(layer, parseFloat(e.target.value));
      });
    });

    // Vehicle Routing Selector
    document.querySelectorAll('[data-vehicle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-vehicle]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const v = e.target.getAttribute('data-vehicle');
        this.layers.setVehicle(v);
      });
    });

    // Detail Panel Close
    const closeBtn = document.getElementById('closeDetailPanel');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeDetailPanel();
      });
    }

    // Detail Panel Fly-to
    const flyBtn = document.getElementById('detailFlyToBtn');
    if (flyBtn) {
      flyBtn.addEventListener('click', () => {
        if (this.selectedEntity) {
          this.globe.viewer.flyTo(this.selectedEntity, {
            duration: 1.2,
            offset: new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-35.0), 400.0)
          });
        }
      });
    }

    // Camera Presets Buttons
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.getAttribute('data-preset');
        this.globe.flyToPreset(preset);
      });
    });

    // Situation Report Download
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.exportSitrep();
      });
    }

    // Shadow Toggle
    const shadowChk = document.getElementById('shadowToggle');
    if (shadowChk) {
      shadowChk.addEventListener('change', (e) => {
        this.globe.toggleShadows(e.target.checked);
      });
    }
  }

  showTooltip(position, text) {
    if (!this.tooltipEl) return;
    this.tooltipEl.style.display = 'block';
    this.tooltipEl.style.left = `${position.x + 12}px`;
    this.tooltipEl.style.top = `${position.y + 12}px`;
    this.tooltipEl.innerText = text;
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
  }

  openDetailPanel(entity) {
    this.selectedEntity = entity;
    if (!this.detailPanelEl) return;

    const props = entity.properties || {};
    const name = entity.name || 'Selected Infrastructure';
    const depth = props.depth ? props.depth.getValue() : 0.0;
    const severity = props.severity ? props.severity.getValue() : 'Moderate';
    const confidence = props.confidence ? props.confidence.getValue() : 82;

    document.getElementById('detailTitle').innerText = name;
    document.getElementById('detailDepth').innerText = `${depth} m`;
    document.getElementById('detailSeverity').innerText = severity;
    document.getElementById('detailConfidenceText').innerText = `${confidence}% likely impassable`;
    document.getElementById('detailConfidenceBar').style.width = `${confidence}%`;

    this.detailPanelEl.classList.remove('hidden');
  }

  closeDetailPanel() {
    if (this.detailPanelEl) {
      this.detailPanelEl.classList.add('hidden');
    }
    this.selectedEntity = null;
  }

  updateRouteStats(vehicle) {
    const timeEst = vehicle === 'ambulance' ? '7 mins' : vehicle === 'truck' ? '12 mins' : '34 mins';
    const noticeEl = document.getElementById('routeNotice');
    if (noticeEl) {
      noticeEl.innerText = `Route mapped to safe shelter (${vehicle}): ~${timeEst} travel time.`;
      noticeEl.style.display = 'block';
    }
  }

  showError(message) {
    const banner = document.createElement('div');
    banner.className = 'feedback-banner';
    banner.innerText = message;
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.prepend(banner);
    }
  }

  exportSitrep() {
    const report = {
      timestamp: new Date().toISOString(),
      aoi: 'Houston Metropolitan Sector 4',
      populationAtRisk: '34,200',
      impassableRoadRatio: '42%',
      operationalShelters: '8 of 10'
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood-situation-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
