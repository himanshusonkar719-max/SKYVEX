import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLANETS } from '../data/spaceData';
import type { PlanetData } from '../data/spaceData';
import { Play, Pause, Compass, Info, Sparkles, ChevronRight } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

export const SolarSystem3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData>(() => 
    PLANETS.find(p => p.id === 'earth') || PLANETS[2]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'perspective' | 'top'>('perspective');
  const [activeTab, setActiveTab] = useState<'overview' | 'atmosphere' | 'missions'>('overview');

  // References for animation state
  const stateRef = useRef({
    isPlaying: true,
    simSpeed: 1,
    selectedPlanetId: 'earth',
    viewMode: 'perspective' as 'perspective' | 'top',
    focusProgress: 0,
    targetCamPos: new THREE.Vector3(0, 45, 95),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    isInteracting: false,
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    stateRef.current.simSpeed = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    stateRef.current.selectedPlanetId = selectedPlanet.id;
  }, [selectedPlanet]);

  useEffect(() => {
    stateRef.current.viewMode = viewMode;
    if (viewMode === 'top') {
      stateRef.current.targetCamPos.set(0, 130, 0.1);
      stateRef.current.targetLookAt.set(0, 0, 0);
    } else {
      stateRef.current.targetCamPos.set(0, 45, 95);
      stateRef.current.targetLookAt.set(0, 0, 0);
    }
  }, [viewMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080B1A, 0.002);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      1200
    );
    camera.position.set(0, 45, 95);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Dynamic Starfield background for Solar System
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 450;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 450;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xA5ABC8,
      size: 0.7,
      transparent: true,
      opacity: 0.6
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Central Sun
    const sunGeo = new THREE.SphereGeometry(7.5, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xFFDC73,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // Sun Corona Glow
    const coronaGeo = new THREE.SphereGeometry(9.2, 32, 32);
    const coronaMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.75 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(1.0, 0.75, 0.25, 1.0) * intensity * 1.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    scene.add(sunCorona);

    // Lighting from Sun
    const sunPointLight = new THREE.PointLight(0xFFFFFF, 3.2, 300, 0.4);
    scene.add(sunPointLight);

    const ambientLight = new THREE.AmbientLight(0x10152E, 0.9);
    scene.add(ambientLight);

    // Create Planet Meshes and Orbit Rings
    interface PlanetMeshItem {
      data: PlanetData;
      mesh: THREE.Mesh;
      pivot: THREE.Group;
      currentAngle: number;
      orbitSpeed: number;
      radius: number;
    }

    const planetMeshes: PlanetMeshItem[] = [];

    PLANETS.forEach((planet, index) => {
      // Orbit Path Line
      const orbitGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * planet.orbitRadius, 0, Math.sin(theta) * planet.orbitRadius));
      }
      orbitGeo.setFromPoints(points);

      const isCurrentSelected = planet.id === 'earth';
      const orbitMat = new THREE.LineBasicMaterial({
        color: isCurrentSelected ? 0x42D9F5 : 0x22305C,
        transparent: true,
        opacity: isCurrentSelected ? 0.65 : 0.35,
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Planet Pivot Group for clean rotation
      const pivot = new THREE.Group();
      scene.add(pivot);

      // Planet Sphere
      const pGeo = new THREE.SphereGeometry(planet.size, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color),
        roughness: 0.7,
        metalness: 0.1,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.x = planet.orbitRadius;
      pivot.add(pMesh);

      // Planet-specific details: Saturn Rings
      if (planet.ring && planet.id === 'saturn') {
        const rGeo = new THREE.RingGeometry(planet.size * 1.5, planet.size * 2.8, 48);
        const rMat = new THREE.MeshBasicMaterial({
          color: 0xE2BF7D,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        const ringMesh = new THREE.Mesh(rGeo, rMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.3;
        pMesh.add(ringMesh);
      }

      // Uranus faint ring
      if (planet.id === 'uranus') {
        const uRingGeo = new THREE.RingGeometry(planet.size * 1.4, planet.size * 1.8, 36);
        const uRingMat = new THREE.MeshBasicMaterial({
          color: 0x68BBE3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4,
        });
        const uRingMesh = new THREE.Mesh(uRingGeo, uRingMat);
        uRingMesh.rotation.x = 0.2;
        pMesh.add(uRingMesh);
      }

      // Initial orbital offset to stagger planets
      const initialAngle = (index / PLANETS.length) * Math.PI * 2 + index * 0.4;
      pivot.rotation.y = initialAngle;

      planetMeshes.push({
        data: planet,
        mesh: pMesh,
        pivot: pivot,
        currentAngle: initialAngle,
        orbitSpeed: planet.orbitSpeed,
        radius: planet.orbitRadius,
      });
    });

    // Raycaster for Planet Picking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = planetMeshes.map(pm => pm.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const matched = planetMeshes.find(pm => pm.mesh === hitMesh);
        if (matched) {
          cosmicAudio.playTelemetryClick();
          setSelectedPlanet(matched.data);
        }
      }
    };

    container.addEventListener('click', handleCanvasClick);

    // Orbit mouse drag interaction for camera
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0;
    let sphericalPhi = Math.PI / 3.2;
    let camRadius = 105;

    const onMouseDown = (e: MouseEvent) => {
      if (e.target !== renderer.domElement) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= dx * 0.006;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2.05, sphericalPhi - dy * 0.006));

      if (stateRef.current.viewMode === 'perspective') {
        const cx = camRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
        const cy = camRadius * Math.cos(sphericalPhi);
        const cz = camRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
        stateRef.current.targetCamPos.set(cx, cy, cz);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Zoom via wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camRadius = Math.max(30, Math.min(180, camRadius + e.deltaY * 0.08));
      if (stateRef.current.viewMode === 'perspective') {
        const cx = camRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
        const cy = camRadius * Math.cos(sphericalPhi);
        const cz = camRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
        stateRef.current.targetCamPos.set(cx, cy, cz);
      } else {
        stateRef.current.targetCamPos.y = camRadius * 1.2;
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Intersection Observer
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const speedFactor = stateRef.current.isPlaying ? stateRef.current.simSpeed : 0;

      // Orbit planets
      planetMeshes.forEach(pm => {
        if (!prefersReducedMotion && speedFactor > 0) {
          pm.pivot.rotation.y += pm.orbitSpeed * speedFactor * delta * 0.6;
        }
        // Self-rotation of planets
        pm.mesh.rotation.y += 0.8 * delta;
      });

      // Sun slow rotation
      sun.rotation.y += 0.08 * delta;

      // Smooth camera interpolation towards target
      camera.position.lerp(stateRef.current.targetCamPos, 0.04);
      currentLookAt.lerp(stateRef.current.targetLookAt, 0.04);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      container.removeEventListener('click', handleCanvasClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      planetMeshes.forEach(pm => {
        pm.mesh.geometry.dispose();
        if (Array.isArray(pm.mesh.material)) {
          pm.mesh.material.forEach(m => m.dispose());
        } else {
          pm.mesh.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  const handleSelectPlanet = (planet: PlanetData) => {
    cosmicAudio.playFocusHum();
    setSelectedPlanet(planet);
  };

  const handleTogglePlay = () => {
    cosmicAudio.playTelemetryClick();
    setIsPlaying(prev => !prev);
  };

  const handleChangeSpeed = (speed: number) => {
    cosmicAudio.playTelemetryClick();
    setSimSpeed(speed);
  };

  const handleToggleView = () => {
    cosmicAudio.playTelemetryClick();
    setViewMode(prev => prev === 'perspective' ? 'top' : 'perspective');
  };

  return (
    <section id="solar-system" className="relative w-full py-24 bg-[#080B1A] border-t border-[#42D9F5]/10 overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#7548D8]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#42D9F5]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152E] border border-[#42D9F5]/30 text-xs font-mono tracking-widest text-[#42D9F5] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Celestial Map</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#F5F4FF]">
              OUR SOLAR SYSTEM
            </h2>
            <p className="mt-3 text-base text-[#A5ABC8] max-w-2xl">
              Eight planets orbiting a luminous yellow dwarf star. Explore planetary architectures, atmospheres, and extreme surface environments.
            </p>
          </div>

          {/* Scale notice badge */}
          <div className="flex items-center gap-2 text-xs text-[#A5ABC8]/80 bg-[#10152E]/80 border border-[#A5ABC8]/20 px-3.5 py-2 rounded-xl backdrop-blur-md">
            <Info className="w-4 h-4 text-[#42D9F5] shrink-0" />
            <span>Planetary sizes and orbits are illustrative for interactive observation</span>
          </div>
        </div>

        {/* 3D Canvas & Telemetry Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main 3D Canvas Stage */}
          <div className="lg:col-span-8 relative h-[480px] sm:h-[580px] rounded-2xl overflow-hidden border border-[#42D9F5]/20 bg-[#080B1A]/80 shadow-2xl glass-panel">
            
            {/* Three.js Container */}
            <div 
              ref={containerRef} 
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
              aria-label="3D Interactive Solar System. Drag to rotate viewpoint, scroll to zoom, click any planet to inspect."
            />

            {/* In-Canvas HUD Controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
              {/* Play/Pause Button */}
              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#10152E]/90 hover:bg-[#151D42] border border-[#42D9F5]/30 text-xs font-mono text-[#F5F4FF] transition-all hover:border-[#42D9F5] shadow-lg"
                title={isPlaying ? "Pause orbital motion" : "Resume orbital motion"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#42D9F5]" /> : <Play className="w-3.5 h-3.5 text-[#42D9F5]" />}
                <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
              </button>

              {/* Simulation Speed Buttons */}
              <div className="flex items-center rounded-lg bg-[#10152E]/90 border border-[#42D9F5]/30 p-0.5 shadow-lg">
                {[0.5, 1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => handleChangeSpeed(spd)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                      simSpeed === spd 
                        ? 'bg-[#42D9F5] text-[#080B1A] font-bold' 
                        : 'text-[#A5ABC8] hover:text-[#F5F4FF]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <button
                onClick={handleToggleView}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10152E]/90 hover:bg-[#151D42] border border-[#42D9F5]/30 text-xs font-mono text-[#F5F4FF] transition-all hover:border-[#42D9F5] shadow-lg"
                title="Switch between orbital 3D perspective and top-down plan view"
              >
                <Compass className="w-3.5 h-3.5 text-[#42D9F5]" />
                <span>{viewMode === 'perspective' ? 'TOP VIEW' : '3D ORBIT'}</span>
              </button>
            </div>

            {/* Instruction Overlay Indicator */}
            <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 text-xs text-[#A5ABC8]/70 bg-[#080B1A]/80 px-3 py-1 rounded-md border border-white/5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#42D9F5] animate-pulse" />
              <span>Click planet mesh or dock to inspect • Drag mouse to rotate • Scroll to zoom</span>
            </div>

            {/* Active focused planet badge */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#10152E]/90 border border-[#42D9F5]/40 text-[#42D9F5]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedPlanet.accentColor }} />
              <span className="font-heading tracking-wider uppercase font-bold">{selectedPlanet.name}</span>
            </div>
          </div>

          {/* Right Column: Planetary Intelligence Dossier */}
          <div className="lg:col-span-4 flex flex-col h-[480px] sm:h-[580px] rounded-2xl glass-panel-glow p-6 overflow-hidden">
            
            {/* Header info */}
            <div className="flex items-start justify-between pb-4 border-b border-[#42D9F5]/15">
              <div>
                <span className="text-xs font-mono tracking-widest text-[#42D9F5] uppercase">
                  {selectedPlanet.type}
                </span>
                <h3 className="text-3xl font-black font-heading text-[#F5F4FF] tracking-wide mt-0.5 flex items-center gap-2">
                  {selectedPlanet.name}
                  {selectedPlanet.id === 'earth' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#42D9F5]/20 text-[#42D9F5] border border-[#42D9F5]/40 font-normal">
                      HOME WORLD
                    </span>
                  )}
                </h3>
              </div>
              <div 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shadow-inner"
                style={{ backgroundColor: `${selectedPlanet.color}25` }}
              >
                <div 
                  className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: selectedPlanet.color, boxShadow: `0 0 14px ${selectedPlanet.accentColor}` }} 
                />
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex border-b border-white/10 my-4">
              {(['overview', 'atmosphere', 'missions'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    cosmicAudio.playTelemetryClick();
                    setActiveTab(tab);
                  }}
                  className={`pb-2 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-[#42D9F5] text-[#42D9F5] font-bold'
                      : 'border-transparent text-[#A5ABC8] hover:text-[#F5F4FF]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dossier Content Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-sm">
              {activeTab === 'overview' && (
                <>
                  <p className="text-[#A5ABC8] leading-relaxed">
                    {selectedPlanet.description}
                  </p>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#080B1A]/60 border border-white/5">
                      <div className="text-[11px] font-mono uppercase text-[#A5ABC8]">Diameter</div>
                      <div className="text-sm font-semibold text-[#F5F4FF] font-mono mt-0.5">{selectedPlanet.diameter}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#080B1A]/60 border border-white/5">
                      <div className="text-[11px] font-mono uppercase text-[#A5ABC8]">Solar Distance</div>
                      <div className="text-sm font-semibold text-[#F5F4FF] font-mono mt-0.5">{selectedPlanet.distanceFromSun}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#080B1A]/60 border border-white/5">
                      <div className="text-[11px] font-mono uppercase text-[#A5ABC8]">Orbital Period</div>
                      <div className="text-sm font-semibold text-[#F5F4FF] font-mono mt-0.5">{selectedPlanet.orbitalPeriod}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#080B1A]/60 border border-white/5">
                      <div className="text-[11px] font-mono uppercase text-[#A5ABC8]">Surface Temp</div>
                      <div className="text-sm font-semibold text-[#F5F4FF] font-mono mt-0.5">{selectedPlanet.surfaceTemp}</div>
                    </div>
                  </div>

                  {/* Scientific Fact Callout */}
                  <div className="p-3.5 rounded-xl bg-[#7548D8]/10 border border-[#7548D8]/30">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#42D9F5] uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fascinating Fact</span>
                    </div>
                    <p className="text-xs text-[#F5F4FF] italic leading-relaxed">
                      "{selectedPlanet.funFact}"
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'atmosphere' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#080B1A]/60 border border-white/5 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#42D9F5]">Atmospheric Composition</div>
                    <p className="text-xs text-[#F5F4FF] leading-relaxed">
                      {selectedPlanet.atmosphere}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080B1A]/60 border border-white/5 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#42D9F5]">Known Natural Satellites</div>
                    <div className="text-2xl font-bold font-mono text-[#F5F4FF]">
                      {selectedPlanet.moons} <span className="text-xs text-[#A5ABC8] font-normal font-sans">Moons detected</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080B1A]/60 border border-white/5 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#42D9F5]">Rotational Day Length</div>
                    <p className="text-xs text-[#F5F4FF]">
                      {selectedPlanet.dayLength}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'missions' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#080B1A]/60 border border-white/5 space-y-2">
                    <div className="text-xs font-mono uppercase text-[#42D9F5]">Exploration History</div>
                    <p className="text-xs text-[#A5ABC8] leading-relaxed">
                      {selectedPlanet.explorationHighlight}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#10152E] border border-[#42D9F5]/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#42D9F5]">Surface Gravity</div>
                      <div className="text-sm font-semibold text-[#F5F4FF]">
                        {selectedPlanet.id === 'jupiter' ? '24.79 m/s²' : selectedPlanet.id === 'earth' ? '9.807 m/s²' : selectedPlanet.id === 'mars' ? '3.72 m/s²' : 'Variable'}
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-[#42D9F5]/10 text-[#42D9F5] border border-[#42D9F5]/30">
                      Standard G
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A5ABC8]">
              <span className="font-mono">SKYVEX // SIM V4.8</span>
              <a 
                href="#missions" 
                className="inline-flex items-center gap-1 text-[#42D9F5] hover:underline font-mono"
              >
                <span>View Missions</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Planet Dock Selector */}
        <div className="mt-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#A5ABC8] mb-3 flex items-center gap-2">
            <span>Direct Planet Navigation:</span>
            <span className="text-[#42D9F5]">(Click to inspect)</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {PLANETS.map((planet) => {
              const isSelected = selectedPlanet.id === planet.id;
              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelectPlanet(planet)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#10152E] border-[#42D9F5] shadow-[0_0_15px_-3px_rgba(66,217,245,0.4)] scale-105'
                      : 'bg-[#10152E]/40 border-white/5 hover:border-white/20 hover:bg-[#10152E]/70'
                  }`}
                >
                  {/* Planet mini sphere visual */}
                  <div 
                    className="w-7 h-7 rounded-full mb-2 transition-transform duration-300 relative flex items-center justify-center"
                    style={{ 
                      backgroundColor: planet.color,
                      boxShadow: isSelected ? `0 0 12px ${planet.accentColor}` : 'none' 
                    }}
                  >
                    {planet.ring && (
                      <div 
                        className="absolute w-11 h-2 rounded-full border border-[#E2BF7D]/60 rotate-[-25deg]" 
                      />
                    )}
                  </div>
                  <span className={`text-xs font-medium tracking-tight ${isSelected ? 'text-[#42D9F5] font-bold' : 'text-[#F5F4FF]'}`}>
                    {planet.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#A5ABC8]/70 mt-0.5">
                    {planet.distanceAU} AU
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
