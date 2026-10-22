import React, { useEffect, useState } from 'react';
import { HeroPlanetCanvas } from './HeroPlanetCanvas';
import { Compass, Rocket, Activity } from 'lucide-react';
import { cosmicAudio } from '../utils/cosmicAudio';

export const HeroSection: React.FC = () => {
  // Live simulated cosmic telemetry metrics
  const [solarWind, setSolarWind] = useState(418);
  const [issAltitude, setIssAltitude] = useState(408.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSolarWind(Math.floor(415 + Math.random() * 8));
      setIssAltitude(Number((408 + Math.sin(Date.now() / 5000) * 0.4).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCtaClick = (target: string) => {
    cosmicAudio.playDeepImpact();
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#080B1A]">
      
      {/* 3D WebGL Three.js Planet & Starfield Canvas */}
      <HeroPlanetCanvas />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080B1A] via-transparent to-[#080B1A]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080B1A]/20 to-[#080B1A]/80 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col justify-between min-h-screen">
        
        {/* Main Hero Typography & Call-to-actions */}
        <div className="my-auto max-w-3xl">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10152E]/90 border border-[#42D9F5]/30 text-xs font-mono tracking-widest text-[#42D9F5] uppercase mb-6 backdrop-blur-md shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#42D9F5] animate-ping" />
            <span>YOUR JOURNEY BEGINS HERE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight text-[#F5F4FF] leading-[1.05] drop-shadow-[0_4px_24px_rgba(8,11,26,0.9)]">
            BEYOND THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F4FF] via-[#42D9F5] to-[#7548D8]">
              BOUNDARIES
            </span> <br />
            OF EARTH.
          </h1>

          {/* Supporting Description */}
          <p className="mt-6 text-base sm:text-xl text-[#A5ABC8] max-w-xl leading-relaxed drop-shadow-md font-sans">
            Discover distant worlds, mysterious galaxies, and the extraordinary wonders of our universe.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleCtaClick('#solar-system')}
              className="px-7 py-3.5 rounded-xl bg-[#42D9F5] hover:bg-[#6ee2f8] text-[#080B1A] font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_-4px_rgba(66,217,245,0.6)] hover:shadow-[0_0_35px_-2px_rgba(66,217,245,0.8)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5"
            >
              <Compass className="w-4 h-4 text-[#080B1A]" />
              <span>EXPLORE THE UNIVERSE</span>
            </button>

            <button
              onClick={() => handleCtaClick('#missions')}
              className="px-7 py-3.5 rounded-xl bg-[#10152E]/85 hover:bg-[#151D42] text-[#F5F4FF] border border-[#42D9F5]/30 hover:border-[#42D9F5] font-mono font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 backdrop-blur-md flex items-center gap-2.5"
            >
              <Rocket className="w-4 h-4 text-[#42D9F5]" />
              <span>DISCOVER MISSIONS</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Live Mission Data Panel & Scroll Indicator */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          
          {/* Cosmic Data Telemetry Panel */}
          <div className="glass-panel p-4 rounded-2xl max-w-md w-full border border-[#42D9F5]/20 shadow-xl backdrop-blur-lg">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
              <span className="text-[#42D9F5] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Deep Space Telemetry</span>
              </span>
              <span className="text-[#A5ABC8]/70">ORBITAL FEED</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#A5ABC8]">Solar Wind Speed</div>
                <div className="font-mono font-semibold text-[#F5F4FF] mt-0.5">{solarWind} km/s</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-[#A5ABC8]">ISS Orbital Alt</div>
                <div className="font-mono font-semibold text-[#F5F4FF] mt-0.5">{issAltitude} km</div>
              </div>
            </div>
          </div>

          {/* Subtle Scroll Indicator */}
          <a
            href="#solar-system"
            onClick={(e) => {
              e.preventDefault();
              handleCtaClick('#solar-system');
            }}
            className="flex flex-col items-center gap-2 text-xs font-mono text-[#A5ABC8] hover:text-[#42D9F5] transition-colors group cursor-pointer self-center sm:self-end"
          >
            <span className="tracking-widest uppercase text-[10px]">SCROLL TO EXPLORE</span>
            <div className="w-5 h-8 rounded-full border border-[#42D9F5]/30 flex items-start justify-center p-1 group-hover:border-[#42D9F5] transition-colors">
              <div className="w-1 h-2 rounded-full bg-[#42D9F5] animate-bounce" />
            </div>
          </a>

        </div>

      </div>

    </section>
  );
};
