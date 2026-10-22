import React, { useState, useEffect, useRef } from 'react';
import { COSMOS_DESTINATIONS } from '../data/spaceData';
import type { CosmosDestination } from '../data/spaceData';
import { ArrowUpRight, X, Sparkles, Radio, Activity, Orbit } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

// Interactive Spiral Galaxy Canvas Component
const SpiralGalaxyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate stars along 2 logarithmic spiral arms
    const stars: { r: number; theta: number; size: number; color: string; speed: number }[] = [];
    for (let i = 0; i < 400; i++) {
      const arm = i % 2 === 0 ? 0 : Math.PI;
      const dist = Math.random() * 140 + 10;
      const spiralTheta = arm + Math.log(dist * 0.08) * 2.2 + (Math.random() - 0.5) * 0.4;
      const size = Math.random() * 1.8 + 0.4;
      const color = Math.random() > 0.4 ? '#42D9F5' : Math.random() > 0.3 ? '#7548D8' : '#F5F4FF';
      stars.push({
        r: dist,
        theta: spiralTheta,
        size,
        color,
        speed: 0.003 * (1 - dist / 220),
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Central galactic bulge glow
      const bulgeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 45);
      bulgeGrad.addColorStop(0, 'rgba(245, 244, 255, 0.9)');
      bulgeGrad.addColorStop(0.3, 'rgba(66, 217, 245, 0.4)');
      bulgeGrad.addColorStop(0.8, 'rgba(117, 72, 216, 0.15)');
      bulgeGrad.addColorStop(1, 'rgba(8, 11, 26, 0)');
      ctx.fillStyle = bulgeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fill();

      // Render stars
      stars.forEach(star => {
        if (!prefersReducedMotion) {
          star.theta += star.speed;
        }
        const x = cx + Math.cos(star.theta + angle) * star.r;
        const y = cy + Math.sin(star.theta + angle) * (star.r * 0.48); // Inclined galactic disk

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        angle += 0.001;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} width={400} height={260} className="w-full h-full object-cover" />;
};

// Interactive Black Hole Relativistic Accretion Disk Canvas
const BlackHoleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Gravitational lensing upper halo
      const haloGrad = ctx.createRadialGradient(cx, cy - 8, 30, cx, cy - 8, 90);
      haloGrad.addColorStop(0, 'rgba(66, 217, 245, 0.6)');
      haloGrad.addColorStop(0.5, 'rgba(117, 72, 216, 0.3)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 90, 0, Math.PI * 2);
      ctx.fill();

      // Accretion disk rings with Doppler beaming (left side approaches, right side recedes)
      for (let r = 70; r >= 38; r -= 4) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.32);

        const diskGrad = ctx.createLinearGradient(-r, 0, r, 0);
        // Doppler boosted blue-shifted intense cyan on left, redshifted violet on right
        diskGrad.addColorStop(0, 'rgba(66, 217, 245, 0.85)');
        diskGrad.addColorStop(0.4, 'rgba(245, 244, 255, 0.9)');
        diskGrad.addColorStop(0.8, 'rgba(117, 72, 216, 0.5)');
        diskGrad.addColorStop(1, 'rgba(60, 20, 100, 0.2)');

        ctx.strokeStyle = diskGrad;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Photon Sphere ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = 'rgba(245, 244, 255, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Event Horizon Shadow (Pure Black Singularity)
      ctx.fillStyle = '#050711';
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      // Subtle accretion matter swirl particles
      if (!prefersReducedMotion) {
        t += 0.03;
      }
      for (let p = 0; p < 8; p++) {
        const pAngle = t * 1.5 + (p * Math.PI) / 4;
        const pDist = 48 + Math.sin(t + p) * 12;
        const px = cx + Math.cos(pAngle) * pDist;
        const py = cy + Math.sin(pAngle) * (pDist * 0.32);
        ctx.fillStyle = 'rgba(245, 244, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} width={400} height={260} className="w-full h-full object-cover" />;
};

// Interactive Exoplanet Transit Canvas
const ExoplanetCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let transitProgress = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Host Star (Orange/Red Dwarf with stellar flares)
      const starGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 75);
      starGrad.addColorStop(0, '#FFF2D9');
      starGrad.addColorStop(0.3, '#FFB247');
      starGrad.addColorStop(0.7, '#E05A1F');
      starGrad.addColorStop(1, 'rgba(224, 90, 31, 0)');

      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.fillStyle = '#FFE2A8';
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Exoplanet Silhouette in Transit
      if (!prefersReducedMotion) {
        transitProgress = (transitProgress + 0.005) % 1;
      } else {
        transitProgress = 0.5;
      }
      
      const planetX = (canvas.width + 80) * transitProgress - 40;
      const planetY = cy - 6 + Math.sin(transitProgress * Math.PI) * 12;

      // Planet silhouette
      ctx.fillStyle = '#080B1A';
      ctx.beginPath();
      ctx.arc(planetX, planetY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Rayleigh scattering rim (illuminated by host star)
      if (planetX > cx - 60 && planetX < cx + 60) {
        ctx.strokeStyle = '#42D9F5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(planetX, planetY, 15, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();
      }

      // Transit Light Curve Telemetry at bottom
      const graphY = canvas.height - 24;
      ctx.strokeStyle = 'rgba(66, 217, 245, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, graphY);
      ctx.lineTo(130, graphY);
      ctx.lineTo(150, graphY + 12);
      ctx.lineTo(250, graphY + 12);
      ctx.lineTo(270, graphY);
      ctx.lineTo(370, graphY);
      ctx.stroke();

      // Transit depth indicator
      ctx.fillStyle = '#42D9F5';
      ctx.font = '9px monospace';
      ctx.fillText('FLUX DIP: -0.84%', 160, graphY + 22);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} width={400} height={260} className="w-full h-full object-cover" />;
};

export const CosmosExplorer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<CosmosDestination | null>(null);

  const handleOpenModal = (dest: CosmosDestination) => {
    cosmicAudio.playDeepImpact();
    setActiveModal(dest);
  };

  const handleCloseModal = () => {
    cosmicAudio.playTelemetryClick();
    setActiveModal(null);
  };

  return (
    <section id="cosmos" className="relative w-full py-24 bg-[#080B1A] border-t border-[#42D9F5]/10 overflow-hidden">
      
      {/* Ambient background lights */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[550px] h-[550px] bg-[#42D9F5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-[#7548D8]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10152E] border border-[#7548D8]/30 text-xs font-mono tracking-widest text-[#42D9F5] uppercase mb-4">
            <Radio className="w-3.5 h-3.5 text-[#42D9F5]" />
            <span>Deep Space Telemetry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#F5F4FF]">
            EXPLORE THE COSMOS
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A5ABC8] leading-relaxed">
            Venture beyond local coordinates. Witness grand island universes, traverse extreme gravitational singularities, and scan distant alien atmospheres for the chemistry of life.
          </p>
        </div>

        {/* 3 Featured Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COSMOS_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="group flex flex-col rounded-2xl glass-panel-glow border border-[#42D9F5]/20 hover:border-[#42D9F5]/60 transition-all duration-300 overflow-hidden hover:-translate-y-1.5 shadow-xl hover:shadow-[0_12px_30px_-8px_rgba(66,217,245,0.2)]"
            >
              {/* Card Canvas Simulation Banner */}
              <div className="relative h-56 w-full bg-[#050711] overflow-hidden border-b border-white/5">
                {dest.id === 'galaxies' && <SpiralGalaxyCanvas />}
                {dest.id === 'black-holes' && <BlackHoleCanvas />}
                {dest.id === 'exoplanets' && <ExoplanetCanvas />}

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#10152E]/90 text-[#42D9F5] border border-[#42D9F5]/30 backdrop-blur-md">
                    {dest.badge}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[10px] font-mono tracking-widest text-[#A5ABC8]/80 bg-[#080B1A]/80 px-2 py-0.5 rounded">
                    {dest.tag}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-[#F5F4FF] group-hover:text-[#42D9F5] transition-colors">
                    {dest.title}
                  </h3>
                  <div className="text-xs font-mono text-[#A5ABC8] mt-1 mb-3">
                    {dest.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#A5ABC8] leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>

                  {/* Quick Stats Ticker */}
                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
                    {dest.stats.map((s, i) => (
                      <div key={i} className="text-left">
                        <div className="text-[10px] font-mono text-[#A5ABC8]/70 truncate">{s.label}</div>
                        <div className="text-xs font-semibold text-[#F5F4FF] font-mono truncate">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleOpenModal(dest)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#10152E] hover:bg-[#151D42] border border-[#42D9F5]/30 hover:border-[#42D9F5] text-xs font-mono font-bold tracking-wider text-[#42D9F5] hover:text-[#F5F4FF] transition-all group-hover:shadow-[0_0_15px_-3px_rgba(66,217,245,0.3)]"
                  >
                    <span>DISCOVER MORE</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Dedicated Detail Modal Dossier */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080B1A]/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-3xl rounded-2xl glass-panel-glow border border-[#42D9F5]/40 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#10152E] hover:bg-[#151D42] border border-white/20 text-[#A5ABC8] hover:text-[#F5F4FF] transition-colors"
              aria-label="Close detail modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-xs font-mono tracking-widest text-[#42D9F5] uppercase">
                {activeModal.tag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-[#F5F4FF] mt-1">
                {activeModal.title}
              </h3>
              <p className="text-sm font-mono text-[#A5ABC8] mt-1">
                {activeModal.subtitle}
              </p>
            </div>

            {/* Astrophysics Overview */}
            <div className="space-y-6 text-sm text-[#A5ABC8]">
              <div className="p-4 rounded-xl bg-[#080B1A]/70 border border-white/5">
                <div className="text-xs font-mono uppercase text-[#42D9F5] mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Astrophysical Overview</span>
                </div>
                <p className="leading-relaxed text-[#F5F4FF]">
                  {activeModal.deepDive.overview}
                </p>
              </div>

              {/* Key Observable Phenomena */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#42D9F5] mb-3 flex items-center gap-2">
                  <Orbit className="w-4 h-4" />
                  <span>Key Observable Phenomena</span>
                </h4>
                <ul className="space-y-2.5">
                  {activeModal.deepDive.keyPhenomena.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F5F4FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#42D9F5] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Astrophysics Telemetry Table */}
              <div className="rounded-xl overflow-hidden border border-white/10">
                <div className="px-4 py-2.5 bg-[#10152E] border-b border-white/10 text-xs font-mono uppercase tracking-wider text-[#42D9F5]">
                  Quantitative Astrophysics Parameters
                </div>
                <div className="divide-y divide-white/5 bg-[#080B1A]/60">
                  {activeModal.deepDive.astrophysicsData.map((row, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#A5ABC8] font-mono">{row.key}</span>
                      <span className="font-semibold text-[#F5F4FF] font-mono">{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Significance Callout */}
              <div className="p-4 rounded-xl bg-[#7548D8]/15 border border-[#7548D8]/30">
                <div className="text-xs font-mono uppercase text-[#42D9F5] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scientific Significance</span>
                </div>
                <p className="text-xs sm:text-sm text-[#F5F4FF] italic leading-relaxed">
                  "{activeModal.deepDive.scientificSignificance}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#A5ABC8]">SKYVEX // COSMIC DOSSIER ARCHIVE</span>
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-xl bg-[#42D9F5] hover:bg-[#6be0f7] text-[#080B1A] font-mono text-xs font-bold tracking-wider transition-colors"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
