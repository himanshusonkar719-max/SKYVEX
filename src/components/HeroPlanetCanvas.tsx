import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroPlanetCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080B1A, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 26);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Procedural Planet Surface Texture
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Cosmic gradient base
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#10152E');
      grad.addColorStop(0.2, '#202958');
      grad.addColorStop(0.35, '#354388');
      grad.addColorStop(0.5, '#42D9F5');
      grad.addColorStop(0.65, '#283570');
      grad.addColorStop(0.8, '#141A38');
      grad.addColorStop(1, '#080B1A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Atmospheric cloud bands
      for (let i = 0; i < 45; i++) {
        const y = Math.random() * 512;
        const h = Math.random() * 25 + 5;
        const alpha = Math.random() * 0.15 + 0.05;
        ctx.fillStyle = i % 2 === 0 
          ? `rgba(66, 217, 245, ${alpha})` 
          : `rgba(117, 72, 216, ${alpha * 0.8})`;
        ctx.fillRect(0, y, 1024, h);
      }

      // Storm vortices
      for (let s = 0; s < 4; s++) {
        const sx = Math.random() * 900 + 50;
        const sy = Math.random() * 300 + 100;
        const rad = Math.random() * 40 + 20;
        const stormGrad = ctx.createRadialGradient(sx, sy, 2, sx, sy, rad);
        stormGrad.addColorStop(0, 'rgba(245, 244, 255, 0.4)');
        stormGrad.addColorStop(0.7, 'rgba(66, 217, 245, 0.2)');
        stormGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = stormGrad;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const planetTexture = new THREE.CanvasTexture(textureCanvas);

    // Planet Mesh
    const planetGeo = new THREE.SphereGeometry(7.2, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.7,
      metalness: 0.15,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(6, -1.5, 0);
    planet.rotation.z = THREE.MathUtils.degToRad(24); // Realistic planetary axial tilt
    scene.add(planet);

    // Atmosphere Glow Shell
    const glowGeo = new THREE.SphereGeometry(7.5, 48, 48);
    const glowMat = new THREE.ShaderMaterial({
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
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.26, 0.85, 0.96, 1.0) * intensity * 1.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereGlow = new THREE.Mesh(glowGeo, glowMat);
    atmosphereGlow.position.copy(planet.position);
    scene.add(atmosphereGlow);

    // Planetary Rings
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 512;
    ringCanvas.height = 1;
    const ringCtx = ringCanvas.getContext('2d');
    if (ringCtx) {
      const rGrad = ringCtx.createLinearGradient(0, 0, 512, 0);
      rGrad.addColorStop(0.0, 'rgba(0,0,0,0)');
      rGrad.addColorStop(0.15, 'rgba(66, 217, 245, 0.45)');
      rGrad.addColorStop(0.45, 'rgba(165, 171, 200, 0.7)');
      rGrad.addColorStop(0.55, 'rgba(10, 14, 34, 0.1)'); // Cassini division
      rGrad.addColorStop(0.7, 'rgba(117, 72, 216, 0.55)');
      rGrad.addColorStop(0.9, 'rgba(66, 217, 245, 0.2)');
      rGrad.addColorStop(1.0, 'rgba(0,0,0,0)');
      ringCtx.fillStyle = rGrad;
      ringCtx.fillRect(0, 0, 512, 1);
    }
    const ringTexture = new THREE.CanvasTexture(ringCanvas);

    const ringGeo = new THREE.RingGeometry(9.8, 16.5, 96);
    // Align texture coords with ring radial axis
    const pos = ringGeo.attributes.position;
    const uvs = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const normDist = (dist - 9.8) / (16.5 - 9.8);
      uvs.setXY(i, normDist, 0);
    }
    uvs.needsUpdate = true;

    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const rings = new THREE.Mesh(ringGeo, ringMat);
    rings.rotation.x = Math.PI / 2 + 0.35;
    rings.rotation.y = -0.2;
    rings.position.copy(planet.position);
    scene.add(rings);

    // Deep Space Starfield (1,800 stars)
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 220;
      starPositions[idx + 1] = (Math.random() - 0.5) * 160;
      starPositions[idx + 2] = (Math.random() - 0.5) * 120 - 40;

      // Color variation: starlight white, electric cyan, faint nebula purple
      const colorChoice = Math.random();
      if (colorChoice > 0.8) {
        starColors[idx] = 0.26;
        starColors[idx + 1] = 0.85;
        starColors[idx + 2] = 0.96; // Cyan
      } else if (colorChoice > 0.6) {
        starColors[idx] = 0.46;
        starColors[idx + 1] = 0.28;
        starColors[idx + 2] = 0.85; // Purple
      } else {
        starColors[idx] = 0.96;
        starColors[idx + 1] = 0.96;
        starColors[idx + 2] = 1.0; // White
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Dynamic Lighting
    // Directional sunlight shining from upper-left
    const sunLight = new THREE.DirectionalLight(0xF5F4FF, 2.5);
    sunLight.position.set(-25, 12, 18);
    scene.add(sunLight);

    // Subtle blue fill light from deep space
    const fillLight = new THREE.DirectionalLight(0x42D9F5, 0.4);
    fillLight.position.set(15, -10, -10);
    scene.add(fillLight);

    // Ambient starlight baseline
    const ambientLight = new THREE.AmbientLight(0x10152E, 0.8);
    scene.add(ambientLight);

    // Mouse Interaction / Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x;
      targetMouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        planet.rotation.y += deltaX * 0.005;
        planet.rotation.x += deltaY * 0.003;
        rings.rotation.z += deltaX * 0.002;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;

      // Adjust camera distance for mobile responsiveness
      if (w < 768) {
        camera.position.set(0, 0, 34);
        planet.position.set(0, 4, 0);
        atmosphereGlow.position.set(0, 4, 0);
        rings.position.set(0, 4, 0);
      } else {
        camera.position.set(0, 2, 26);
        planet.position.set(6, -1.5, 0);
        atmosphereGlow.position.set(6, -1.5, 0);
        rings.position.set(6, -1.5, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Visibility-based render optimization
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const rotationSpeed = prefersReducedMotion ? 0.03 : 0.12;

      // Automated planetary rotation
      if (!isDragging) {
        planet.rotation.y += rotationSpeed * delta;
        rings.rotation.z += (rotationSpeed * 0.3) * delta;
      }

      // Parallax smooth camera damping
      if (!prefersReducedMotion) {
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;
        camera.position.x = (w => w < 768 ? 0 : 0)(container.clientWidth) + mouseX * 1.5;
        camera.position.y = (w => w < 768 ? 0 : 2)(container.clientWidth) + mouseY * 1.2;
        camera.lookAt(
          container.clientWidth < 768 ? 0 : 4,
          container.clientWidth < 768 ? 3 : -1,
          0
        );
      }

      // Gentle starfield drift
      starField.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      planetGeo.dispose();
      planetMat.dispose();
      planetTexture.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringTexture.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D Planet and Universe Canvas. Drag to rotate."
      role="img"
    >
      {/* Subtle interaction cue */}
      <div 
        className={`absolute bottom-6 right-6 z-20 pointer-events-none transition-opacity duration-300 hidden sm:flex items-center gap-2 text-xs text-[#A5ABC8]/70 px-3 py-1.5 rounded-full glass-panel ${
          isInteracting ? 'opacity-0' : 'opacity-80'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#42D9F5] animate-ping" />
        <span className="font-mono tracking-wider uppercase">Drag to Rotate World</span>
      </div>
    </div>
  );
};
