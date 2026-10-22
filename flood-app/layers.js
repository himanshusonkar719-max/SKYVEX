import * as Cesium from 'cesium';

export class LayerManager {
  constructor(globeManager, uiManager) {
    this.globe = globeManager;
    this.viewer = globeManager.viewer;
    this.ui = uiManager;

    this.entities = {
      flood: [],
      roads: [],
      buildings: [],
      confidence: [],
      shelters: [],
      route: []
    };

    this.opacities = {
      flood: 0.85,
      roads: 1.0,
      buildings: 0.9,
      confidence: 0.6,
      shelters: 1.0,
      route: 1.0
    };

    this.hoveredEntity = null;
    this.hoverOriginalAlt = 0;
    this.selectedVehicle = 'ambulance'; // 'ambulance' | 'truck' | 'foot'
    this.lastRouteClickPoint = null;

    this.initHoverAndSelect();
    this.loadSyntheticGeoData();
  }

  setLayerOpacity(layerKey, opacity) {
    this.opacities[layerKey] = opacity;
    const list = this.entities[layerKey] || [];
    list.forEach(ent => {
      if (ent.polygon && ent.polygon.material && ent.polygon.material.color) {
        const c = ent.polygon.material.color.getValue();
        if (c) ent.polygon.material = c.withAlpha(opacity);
      } else if (ent.polyline && ent.polyline.material && ent.polyline.material.color) {
        const c = ent.polyline.material.color.getValue();
        if (c) ent.polyline.material = c.withAlpha(opacity);
      }
    });
    this.globe.requestRender();
  }

  setLayerVisibility(layerKey, visible) {
    const list = this.entities[layerKey] || [];
    list.forEach(ent => {
      ent.show = visible;
    });
    this.globe.requestRender();
  }

  loadSyntheticGeoData() {
    const centerLon = -95.3698;
    const centerLat = 29.7604;

    // 1. Flood Extruded Cells (Semantic Blue Gradient)
    const floodColor = Cesium.Color.fromCssColorString('#4FA3D1').withAlpha(this.opacities.flood);
    const floodPolygon = this.viewer.entities.add({
      name: 'Simulated Flood Inundation Area',
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          centerLon - 0.015, centerLat - 0.012,
          centerLon + 0.015, centerLat - 0.012,
          centerLon + 0.018, centerLat + 0.014,
          centerLon - 0.014, centerLat + 0.015
        ]),
        extrudedHeight: 2.2,
        height: 0.0,
        material: floodColor,
        outline: false
      },
      properties: {
        type: 'flood',
        depth: 2.2,
        severity: 'Critical',
        confidence: 94
      }
    });
    this.entities.flood.push(floodPolygon);

    // 2. Road Network (Open #5FB878, Impassable #E5534B)
    const roadPoints1 = [
      centerLon - 0.02, centerLat - 0.005,
      centerLon, centerLat - 0.002,
      centerLon + 0.02, centerLat - 0.001
    ];
    const openRoad = this.viewer.entities.add({
      name: 'Main Transit Arterial (West-East)',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(roadPoints1),
        width: 6,
        material: Cesium.Color.fromCssColorString('#5FB878').withAlpha(this.opacities.roads),
        clampToGround: false
      },
      properties: {
        type: 'road',
        status: 'Passable',
        depth: 0.1,
        severity: 'Low',
        confidence: 12
      }
    });
    this.entities.roads.push(openRoad);

    const roadPoints2 = [
      centerLon - 0.008, centerLat - 0.015,
      centerLon - 0.002, centerLat,
      centerLon + 0.005, centerLat + 0.018
    ];
    const floodedRoad = this.viewer.entities.add({
      name: 'Bayou Corridor Expressway',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(roadPoints2),
        width: 6,
        material: Cesium.Color.fromCssColorString('#E5534B').withAlpha(this.opacities.roads),
        clampToGround: false
      },
      properties: {
        type: 'road',
        status: 'Impassable',
        depth: 1.8,
        severity: 'High',
        confidence: 87
      }
    });
    this.entities.roads.push(floodedRoad);

    // 3. Buildings with 3D Extrusions
    const bldgCoords = [
      { lon: centerLon - 0.005, lat: centerLat + 0.003, h: 42 },
      { lon: centerLon + 0.004, lat: centerLat + 0.005, h: 65 },
      { lon: centerLon - 0.002, lat: centerLat - 0.006, h: 30 }
    ];
    bldgCoords.forEach((b, i) => {
      const ent = this.viewer.entities.add({
        name: `Municipal Facility ${i + 1}`,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            b.lon - 0.001, b.lat - 0.001,
            b.lon + 0.001, b.lat - 0.001,
            b.lon + 0.001, b.lat + 0.001,
            b.lon - 0.001, b.lat + 0.001
          ]),
          extrudedHeight: b.h,
          height: 0.0,
          material: Cesium.Color.fromCssColorString('#3A2A42').withAlpha(this.opacities.buildings),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#B9A38B')
        },
        properties: {
          type: 'building',
          depth: 0.4,
          severity: 'Moderate',
          confidence: 68
        }
      });
      this.entities.buildings.push(ent);
    });

    // 4. Safe Shelters
    const shelter1 = this.viewer.entities.add({
      name: 'North Central Evacuation Shelter',
      position: Cesium.Cartesian3.fromDegrees(centerLon + 0.015, centerLat + 0.015, 0),
      point: {
        pixelSize: 14,
        color: Cesium.Color.fromCssColorString('#7FB77E'),
        outlineColor: Cesium.Color.fromCssColorString('#F2EBE3'),
        outlineWidth: 2
      },
      properties: {
        type: 'shelter',
        capacity: '450 / 800 beds',
        status: 'Operational',
        depth: 0.0,
        severity: 'Safe',
        confidence: 99
      }
    });
    this.entities.shelters.push(shelter1);

    this.globe.requestRender();
  }

  initHoverAndSelect() {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    // Pointer Hover: lift 2m & outline + tooltip
    handler.setInputAction((movement) => {
      const pickedObject = this.viewer.scene.pick(movement.endPosition);

      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        const entity = pickedObject.id;

        if (this.hoveredEntity !== entity) {
          this.resetHover();
          this.hoveredEntity = entity;

          // Lift 2m if polygon
          if (entity.polygon && entity.polygon.height) {
            this.hoverOriginalAlt = entity.polygon.height.getValue();
            entity.polygon.height = this.hoverOriginalAlt + 2.0;
            if (entity.polygon.extrudedHeight) {
              const prevExt = entity.polygon.extrudedHeight.getValue();
              entity.polygon.extrudedHeight = prevExt + 2.0;
            }
          }

          this.ui.showTooltip(movement.endPosition, entity.name || 'Feature');
          this.globe.requestRender();
        }
      } else {
        if (this.hoveredEntity) {
          this.resetHover();
          this.ui.hideTooltip();
          this.globe.requestRender();
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Left Click: Side Detail Panel (Not a modal) & Route Tool
    handler.setInputAction((click) => {
      const pickedObject = this.viewer.scene.pick(click.position);

      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        this.ui.openDetailPanel(pickedObject.id);
      } else {
        // Map click draws animated route to nearest shelter
        const ray = this.viewer.camera.getPickRay(click.position);
        const cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        if (cartesian) {
          this.calculateAndDrawRoute(cartesian);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  resetHover() {
    if (!this.hoveredEntity) return;
    if (this.hoveredEntity.polygon && this.hoveredEntity.polygon.height) {
      this.hoveredEntity.polygon.height = this.hoverOriginalAlt;
      if (this.hoveredEntity.polygon.extrudedHeight) {
        const prevExt = this.hoveredEntity.polygon.extrudedHeight.getValue();
        this.hoveredEntity.polygon.extrudedHeight = Math.max(0, prevExt - 2.0);
      }
    }
    this.hoveredEntity = null;
  }

  setVehicle(vehicleType) {
    this.selectedVehicle = vehicleType;
    if (this.lastRouteClickPoint) {
      this.calculateAndDrawRoute(this.lastRouteClickPoint);
    }
  }

  calculateAndDrawRoute(fromPoint) {
    this.lastRouteClickPoint = fromPoint;
    const dest = Cesium.Cartesian3.fromDegrees(-95.3698 + 0.015, 29.7604 + 0.015, 0);

    // Clear previous route
    this.entities.route.forEach(r => this.viewer.entities.remove(r));
    this.entities.route = [];

    // Interpolate points with vehicle-speed style offset
    const positions = [fromPoint, dest];

    const routeLine = this.viewer.entities.add({
      name: `Evacuation Pathway (${this.selectedVehicle})`,
      polyline: {
        positions: positions,
        width: this.selectedVehicle === 'truck' ? 8 : this.selectedVehicle === 'ambulance' ? 6 : 4,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.25,
          color: Cesium.Color.fromCssColorString('#5FB878')
        })
      }
    });

    this.entities.route.push(routeLine);
    this.ui.updateRouteStats(this.selectedVehicle);
    this.globe.requestRender();
  }
}
